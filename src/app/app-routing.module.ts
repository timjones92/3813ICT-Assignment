import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupComponent } from './group/group.component';
import { ChannelComponent } from './channel/channel.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: '', outlet: 'group', component: GroupComponent},
  {path: '', outlet: 'admin', component: AdminComponent},
  {path: 'channels/:id', component: ChannelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

