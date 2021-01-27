import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css'],
})
export class AddBlogComponent {

  title: string;
  summary: string;
  selectedFile: File;
  date: Date;
  bodyString: string;
  body: { tag: string; element: string }[] = [];
  errorMessage: string;
  isLoading = false;

  constructor(private authService: AuthService) {}

  onFileSelected(event) {
    this.errorMessage = null;
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit() {
    this.errorMessage = null;
    console.log(this.date, this.summary);
    if (
      !this.selectedFile ||
      !this.body.length ||
      this.title.trim().length < 5 ||
      this.summary.trim().length < 10 ||
      !this.date
    ){
      this.errorMessage = 'Validation error';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('summary', this.summary);
    formData.append('title', this.title);
    formData.append('date', this.date.toDateString());
    formData.append('body', JSON.stringify(this.body));
    this.isLoading = true;
    this.authService
      .blogRequest(formData)
      .subscribe((response) => {
        console.log(response);
        if(response.success){
          this.resetForm();
          this.errorMessage = "Blog saved sucsessfully.";
        }
      });
  }

  resetForm(){
    this.title = null;
    this.summary = null;
    this.selectedFile = null;
    this.date = null;
    this.bodyString = null;
    this.body = [];;
    this.errorMessage = null;
    this.isLoading = false;
  }

  onPrewiew(){
    this.errorMessage = null;
    this.body = [];
    const bodyArray = this.bodyString.split('\n')
    for (let line of bodyArray){
      line = line.trim();
      if (line.startsWith('---')){
        this.body.push({tag: 'header', element: line.substring(3).trim()})
      } else if (line.startsWith('*')){
        this.body.push({tag: 'listItem', element: line.substring(1).trim()})
      } else {
        this.body.push({tag: 'paragraph', element: line.trim()})
      }
    }
    console.log(bodyArray);
  }
}
