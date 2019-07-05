import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<div>
  <app-navigation></app-navigation>
  <main class="column">
    <!-- Routed views go here -->
    <router-outlet></router-outlet>
  </main>
  <app-footer></app-footer>
</div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
