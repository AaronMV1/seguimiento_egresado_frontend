

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeader } from '../header/header';
import { PublicFooter } from "../footer/footer";


@Component({
  selector: 'app-public-content-full',
  imports: [RouterOutlet, PublicHeader, PublicFooter],
  templateUrl: './content-full.html',
  styleUrl: './content-full.css',
})


export class PublicContentFull {}


