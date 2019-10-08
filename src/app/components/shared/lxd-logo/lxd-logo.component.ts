import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lxd-logo',
  template: `
<a routerLink="/">
  <div class="logo middle-xs">
    <div class="logo-text middle-xs">
      <span class="accent-color">LXD</span>
      <span class="light-color">Hub</span>
    </div>
  </div>
</a>
  `,
  styleUrls: ['./lxd-logo.component.css']
})
export class LxdLogoComponent { }
