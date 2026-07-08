

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateHeader } from "../header/header";
import { PrivateFooter } from "../footer/footer";


@Component({
  selector: 'app-private-content-full',
  imports: [RouterOutlet, PrivateHeader, PrivateFooter],
  templateUrl: './content-full.html',
  styleUrl: './content-full.css',
})


export class PrivateContentFull {}

