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

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  constructor(private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase) { }

  ngOnInit(): void {
  }



  

}
