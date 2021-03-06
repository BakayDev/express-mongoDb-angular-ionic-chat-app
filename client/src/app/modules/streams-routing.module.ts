import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StreamsComponent} from '../components/steams/streams.component';
import {AuthGuard} from '../services/auth.guard';
import {CommentsComponent} from '../components/comments/comments.component';
import {PeopleComponent} from '../components/people/people.component';


const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    component: CommentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    component: PeopleComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }
