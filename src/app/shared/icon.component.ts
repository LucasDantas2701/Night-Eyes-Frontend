import { Component, input, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ICONS, IconName } from './icons';

/** Uso: <ne-icon name="car" class="w-5 h-5" /> */
@Component({
  selector: 'ne-icon',
  imports: [LucideAngularModule],
  template: `<lucide-angular [img]="img()" [size]="size()" class="block"></lucide-angular>`,
  host: { class: 'inline-flex shrink-0' },
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(24);
  img = computed(() => ICONS[this.name()]);
}
