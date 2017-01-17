import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  backgroundProfile: string = 'http://wallpaperpawn.us/wp-content/uploads/2016/07/royal-wall-paper-minimalistic-pink-patterns-damask-royal-simple-wallpapers.jpg';
  profilePicture: string = 'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-9/14051786_1146069705449340_95700626649935794_n.jpg?oh=04be87d50b50a66ce9b42022df8b2fe5&oe=58E04019';
  constructor() { }

  ngOnInit() {
  }

}
