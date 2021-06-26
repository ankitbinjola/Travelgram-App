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
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

picture : string = 'https://www.zsl.org/sites/default/files/media/2014-10/SG9A8359.jpg';
uploadPercent = null;

  constructor(private auth : AuthService, private router: Router, private toastr: ToastrService
    , private storage: AngularFireStorage, private db: AngularFireDatabase) { }

  ngOnInit(): void {
console.log()
  }

//on form submit
onSubmit(f: NgForm){
    const { email, password, country, bio, name, username } = f.form.value;    //destructing getting values from the form
    
    this.auth.signUp(email, password).then((res)=> {
      console.log(res);
      const { uid } = res.user  //destructing 
      this.db.object(`/user/${uid}`).set({    //creating collection and document under firebase and setting keys for them
        id: uid,
        name: name,
        email: email,
        country: country,
        bio: bio,
        username : username,
        picture: this.picture
      })
    }).then(() => {
      this.router.navigateByUrl('/signin');
      this.toastr.success("hey you have signed up .. horray")
    }).catch((error)=> {
      console.log("error block of signup.ts");
      this.toastr.error("somthing went wrong");
    })

}

//uploading file on firebase

async uploadFile(event){
  const file = event.target.files[0];  //fetching the file from the event 
  let resizedImage = await readAndCompressImage(file, Imageconfig);
  const filePath = file.name //   rename the image with UUID 
  const fileRef = this.storage.ref(filePath) //grabing the file 

  const task = this.storage.upload(filePath, resizedImage);  //task to upload the image in the storage

task.percentageChanges().subscribe((percentage) => {    //percent changes function subscribe on task constantly checking upload %
  this.uploadPercent = percentage ; 
});

task.snapshotChanges().pipe(    //downloading the url
  finalize(() => {
    fileRef.getDownloadURL().subscribe((url) => {
      this.picture = url;
      this.toastr.success("image upload success");
    })
  })
).subscribe();


}







}
