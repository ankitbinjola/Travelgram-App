import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Imageconfig } from '../../../util/image-config'
//angular forms
import { NgForm } from '@angular/forms';
//firebase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
//browser image reaseizer
import { finalize } from 'rxjs/operators';
import { readAndCompressImage } from 'browser-image-resizer';
import { v4 as uuidv4 } from 'uuid';
import { concat } from 'rxjs';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {
  locationName: string;
  description: string;
  picture: string = null;
  user = null;
  uploadPercent: number = null;


  constructor(private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase) {

     this.auth.getUser().subscribe((user) => {
        this.db.object(`/user/${user.uid}`)
        .valueChanges().subscribe((user) => {
          this.user = user;
          console.log('hey there' + JSON.stringify(this.user.name));
          console.log('hey there' + JSON.stringify(this.user.username));
        });
      });
     }
  
    ngOnInit(): void {
console.log(this.user);
    }
//creating new post object in the db with same uid and some of the user details from the posts


  onSubmit(){
    const uid = uuidv4();
    this.db.object(`/posts/${uid}`)
    .set({
      id: uid,
      locationName : this.locationName,
      description: this.description,
      picture: this.picture,
      by: this.user.name,
      instaId: this.user.username,
      date: Date.now()
    }).then( () => {
      this.toastr.success("success in posts");
    this.router.navigateByUrl('/');
  }
    ).catch((err) => {
      this.toastr.error("oops in posts");
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];
    let resizedImage = await readAndCompressImage(file, Imageconfig);
    const filePath = file.name.concat(uuidv4()) ;
    // console.log(filePath.concat(uuidv4()));
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage)=> {
      this.uploadPercent= percentage;
    })

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("Image Uploaded Successfully");
   
        })
      })
    ).subscribe()

  }

}
