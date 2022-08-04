import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-sri',
  templateUrl: './sri.component.html',
  styleUrls: ['./sri.component.css']
})
export class SriComponent implements OnInit {
  // other variables
  title = 'Resume'
  itemRef: AngularFireObject<any>
  itemsRefList: AngularFireList<any>
  // firebase object variables
  main = {
    skills: new Observable<any>()
  }
  item!: Observable<any>
  skills!: Observable<any>
  edu!: Observable<any>
  social!: Observable<any>
  about!: Observable<any>
  web!: Observable<any>
  dataObj:any
  // show and hide 
  loginDiv: boolean = true
  logoutDiv: boolean = false

  // get from local storage
  activeUser: any = localStorage.getItem('activeUser')

  constructor(db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.itemRef = db.object('data')
    this.itemRef.snapshotChanges().subscribe(action => {
      // console.log("types",action.type)
      // console.log("keys",action.key)
      console.log("val", action.payload.val())
      // skills object
      this.main.skills = action.payload.val().skills
      console.log(this.main.skills, "main")
      // education objects of object
      this.edu = action.payload.val().education
      // socialMedia
      this.social = action.payload.val().socialMedia
      // webDeveloper
      this.web = action.payload.val().webDeveloper
      // about
      this.about = action.payload.val().about
    })
    // const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

    this.itemsRefList = db.list('data/webDeveloper/')
    this.dataObj = this.itemsRefList.snapshotChanges().pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))))
    console.log("New User Data", this.dataObj)
  }
  // this.item = db.object('data/skills').valueChanges();
  // console.log(this.item, "newwwwwwwwww data")

  ngOnInit() {
    if (JSON.parse(this.activeUser)) {
      this.loginDiv = false
      this.logoutDiv = true
    }
    else {
      this.loginDiv = true
      this.logoutDiv = false
    }

  }


  login() {
    this.activeUser = this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    console.log(this.auth.user, "User data")
    // if (isUserLoggedIn) {
    //   setUserDetails({});
    //   setUserAuthStatus(false);
    // } else {
    //   auth
    //     .signInWithPopup(provider)
    //     .then(res => {
    //       const { displayName, email, photoURL } = res.user;
    //       const userInfo = {
    //         photoURL,
    //         email,
    //         name: displayName
    //       };
    //       setUserDetails(userInfo);
    //       setUserAuthStatus(true);

    //       return res;
    //     })
    //     .catch(err => err);
    // }
    // }

    localStorage.setItem('activeUser', JSON.stringify(this.activeUser))
    if (this.auth.user) {
      this.loginDiv = false
      this.logoutDiv = true
    }
  }

  logout() {
    this.auth.signOut()
    localStorage.clear()
    this.loginDiv = true
    this.logoutDiv = false
  }


  checkUser() { }

}
