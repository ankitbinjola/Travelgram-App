import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;

  constructor( private toastr: ToastrService,  private router: Router, private auth: AuthService  ) { 
    this.auth.getUser().subscribe((user) => {
      this.email = user?.email ;
    })
  }

  ngOnInit(): void {
  }

 async handleSignOut(){
  try{
    await this.auth.signOut();
    this.router.navigateByUrl('/signin');
    this.toastr.success('why you left logged out..')
  }
  catch(error){
    this.toastr.error('signout failed')
  }


 }




}
