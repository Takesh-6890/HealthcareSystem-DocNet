import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConsultationService } from '../../../core/services/consultation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-video-room',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="video-page">
      <div class="video-header">
        <button mat-icon-button (click)="goBack()"><mat-icon>arrow_back</mat-icon></button>
        <h2>Video Consultation</h2>
        <span class="live-badge" *ngIf="safeUrl">
          <span class="live-dot"></span> LIVE
        </span>
      </div>

      <div *ngIf="loading" class="connecting">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Connecting to video room...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="load()">Retry</button>
      </div>

      <div *ngIf="safeUrl && !loading" class="iframe-wrapper">
        <iframe [src]="safeUrl"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                allowfullscreen>
        </iframe>
      </div>
    </div>
  `,
  styles: [`
    .video-page { display:flex; flex-direction:column; height:calc(100vh - 112px); }
    .video-header { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
    .video-header h2 { margin:0; font-size:20px; font-weight:500; flex:1; }
    .live-badge { display:flex; align-items:center; gap:6px; background:#ff1744; color:white; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .live-dot { width:8px; height:8px; border-radius:50%; background:white; animation:pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .connecting, .error-state { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:16px; color:#666; }
    .error-icon { font-size:64px; width:64px; height:64px; color:#f44336; }
    .iframe-wrapper { flex:1; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.15); }
    iframe { width:100%; height:100%; border:none; }
  `]
})
export class VideoRoomComponent implements OnInit {
  safeUrl: SafeResourceUrl | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultSvc: ConsultationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    const id = this.route.snapshot.paramMap.get('id')!;
    this.consultSvc.getVideoToken(id).subscribe({
      next: res => {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.roomUrl);
        this.loading = false;
      },
      error: () => { this.error = 'Failed to connect to video room. Please try again.'; this.loading = false; }
    });
  }

  goBack() { this.router.navigate(['..'], { relativeTo: this.route }); }
}
