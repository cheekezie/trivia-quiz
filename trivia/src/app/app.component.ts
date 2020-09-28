import {Component, Renderer2} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Event as RouterEvent} from '@angular/router';
import {RouteConfigLoadEnd} from '@angular/router';
import {RouteConfigLoadStart} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isShowingRouteLoadIndicator: boolean;

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
  }
  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#appLoader');
    this.renderer.setStyle(loader, 'display', 'none');
  }
  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    //setting route title for SEO improvement
    this.router
      .events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const child = this.activatedRoute.firstChild;
        if (child.snapshot.data['title']) {
          return child.snapshot.data['title'];
        }
        return appTitle;
      })
    ).subscribe((ttl: string) => {
      this.titleService.setTitle(ttl);
    });

    // this.router.events.subscribe((evt) => {
    //   if (!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0, 0);
    // });

  }
}
