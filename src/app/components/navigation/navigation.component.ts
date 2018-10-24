import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
<nav class="app-navigation background-primary-color row middle-xs layout-padding">
  <div class="app-navigation-container row
  col-lg-8
  col-lg-offset-2
  col-md-10
  col-md-offset-1
  col-sm-10
  col-sm-offset-1
  col-xs-12
  col-xs-offset-0
  layout-padding">
    <app-lxd-logo></app-lxd-logo>
    <!-- Spacer -->
    <div class="col-xs"></div>
    <div class="nav-items row middle-xs end-xs light-color">
      <a routerLink="/images" class="nav-item">Images</a>
      <a href="https://github.com/Roche/lxdhub" class="nav-item">Github</a>
    </div>
  </div>
</nav>
  `,
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
