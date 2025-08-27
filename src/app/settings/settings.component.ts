import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {
  settings: any = {};

  constructor(private settingsService: SettingsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe(data => {
      this.settings = data || {};
    });
  }

  saveSettings(): void {
    this.settingsService.updateSettings(this.settings).subscribe(() => {
      this.snackBar.open('Settings updated successfully!', 'Close', { duration: 3000 });
    });
  }

  resetToDefault(): void {
    this.settingsService.resetSettings().subscribe(data => {
      this.settings = data;
      this.snackBar.open('Settings reset to default!', 'Close', { duration: 3000 });
    });
  }
}
