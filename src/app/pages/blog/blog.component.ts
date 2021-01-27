import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  data;
  blogs: Blog [] = [];
  breakpoint: number;
  isLoading = false;
  errorMessage: string;
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions = [10];
  showFirstLastButtons = true;

  constructor(private router: Router, private databaseHandlerService: DatabaseHandlerService) { }

  ngOnInit(): void {
    this.calculateBreakPoint(window.innerWidth);
    this.fetchData(null);

  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.isLoading = true;
    this.fetchData(this.data.meta.links[this.pageIndex+1].url);
  }

  fetchData(url: null) {
    this.blogs = [];
    this.databaseHandlerService.getBlogs(url).subscribe(
      response => this.subscribeResponse(response),
      errorMessage => this.subscribeError(errorMessage)
    );
  }

  subscribeResponse(response){
    console.log(response);
    this.data = response;
    for (let blog of response.data){
      this.blogs.push({
        id: blog.id.toString(),
        title: blog.title,
        summary: blog.summary,
        imageUrl: blog.imageUrl,
        body: JSON.parse(blog.body),
        date : new Date(blog.date)
      });
    }
    this.length = this.data.meta.total;
    this.pageSize = this.data.meta.per_page;
    this.pageIndex = this.data.meta.current_page-1;
    this.isLoading = false;
  }

  subscribeError(errorMessage){
    this.errorMessage = errorMessage;
    console.log(this.errorMessage);
    this.isLoading = false;
  }

  onBlogClick(id: number){
    this.router.navigateByUrl('/blog/' + id);
  }

  onResize(event) {
    this.calculateBreakPoint(event.target.innerWidth);
  }

  calculateBreakPoint(innerWidth: number) {
    if (innerWidth < 1201){
      this.breakpoint = 1;
    } else this.breakpoint = 2;
  }

}

export class Blog {
  id: string;
  title: string;
  summary: string;
  body: { tag: string; element: string }[] = [];
  imageUrl: string;
  date: Date;
}
