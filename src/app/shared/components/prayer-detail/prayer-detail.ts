import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface PrayerInfo {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  fard: number;
  sunnahBefore: number;
  sunnahAfter: number;
  witr: number;
  timeDesc: string;
  virtues: string;
  sunnahDesc: string;
  note?: string;
}

const PRAYERS: Record<string, PrayerInfo> = {
  fajr: {
    id: 'fajr',
    name: 'الفجر',
    icon: 'fa-solid fa-sun-haze',
    colorClass: 'dawn',
    fard: 2,
    sunnahBefore: 2,
    sunnahAfter: 0,
    witr: 0,
    timeDesc: 'من طلوع الفجر الصادق إلى شروق الشمس',
    virtues: 'قال ﷺ: «رَكعَتا الفَجرِ خيرٌ مِنَ الدُّنيا وما فيها». وصلاة الفجر في جماعة تعدل قيام نصف الليل.',
    sunnahDesc: 'ركعتان قبل الفريضة، يُستحب تخفيفهما. يُستحب الاضطجاع على الجنب الأيمن بعدهما.',
    note: 'لا سنة بعد الفجر حتى ترتفع الشمس.',
  },
  dhuhr: {
    id: 'dhuhr',
    name: 'الظهر',
    icon: 'fa-solid fa-sun',
    colorClass: 'noon',
    fard: 4,
    sunnahBefore: 4,
    sunnahAfter: 2,
    witr: 0,
    timeDesc: 'من زوال الشمس إلى أن يصير ظل كل شيء مثله',
    virtues: 'تُفتح أبواب السماء عند الزوال فيُستحب الإكثار من الذكر والدعاء.',
    sunnahDesc: '4 ركعات قبل الفريضة و2 ركعات بعدها. قال ﷺ: «من حافظ على أربع ركعات قبل الظهر وأربع بعدها حرّمه الله على النار».',
  },
  asr: {
    id: 'asr',
    name: 'العصر',
    icon: 'fa-solid fa-cloud-sun',
    colorClass: 'afternoon',
    fard: 4,
    sunnahBefore: 4,
    sunnahAfter: 0,
    witr: 0,
    timeDesc: 'من صيرورة الظل مثل صاحبه إلى غروب الشمس',
    virtues: 'قال ﷺ: «من فاتته صلاة العصر فكأنما وُتر أهله وماله». وهي الصلاة الوسطى.',
    sunnahDesc: '4 ركعات قبل العصر. قال ﷺ: «رحم الله امرأً صلى قبل العصر أربعاً».',
    note: 'تُكره الصلاة بعد العصر حتى الغروب إلا لذات سبب.',
  },
  maghrib: {
    id: 'maghrib',
    name: 'المغرب',
    icon: 'fa-solid fa-sunset',
    colorClass: 'sunset',
    fard: 3,
    sunnahBefore: 2,
    sunnahAfter: 2,
    witr: 0,
    timeDesc: 'من غروب الشمس إلى مغيب الشفق الأحمر',
    virtues: 'يُستحب تعجيل الإفطار قبلها في رمضان. ووقتها قصير فيُبادَر إليها.',
    sunnahDesc: 'ركعتان بعد المغرب، وقيل ركعتان قبلها. كان النبي ﷺ يصلي ركعتين في بيته بعدها.',
  },
  isha: {
    id: 'isha',
    name: 'العشاء',
    icon: 'fa-solid fa-moon',
    colorClass: 'night',
    fard: 4,
    sunnahBefore: 0,
    sunnahAfter: 2,
    witr: 1,
    timeDesc: 'من مغيب الشفق الأحمر إلى منتصف الليل (الأفضل)',
    virtues: 'قال ﷺ: «لو يعلم الناس ما في النداء والصف الأول ثم لم يجدوا إلا أن يستهموا عليه لاستهموا». وقيامها يعدل قيام نصف الليل.',
    sunnahDesc: 'ركعتان بعد الفريضة، ثم الوتر (1–11 ركعة). والوتر آكد السنن الراتبة.',
    note: 'يُستحب تأخيرها إلى ثلث الليل إذا أمكن.',
  },
  qiyam: {
    id: 'qiyam',
    name: 'قيام الليل',
    icon: 'fa-solid fa-star-and-crescent',
    colorClass: 'night',
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    witr: 1,
    timeDesc: 'بعد صلاة العشاء حتى الفجر، وأفضله الثلث الأخير',
    virtues: 'قال ﷺ: «أفضل الصلاة بعد الفريضة صلاة الليل». ويُقرّب العبد من ربه ويكفّر الذنوب.',
    sunnahDesc: 'يُصلى ركعتين ركعتين، ويُختم بالوتر. لا حد أدنى لعدد الركعات، ولا حد أعلى.',
    note: 'أفضل وقته الثلث الأخير من الليل، قال ﷺ: «ينزل ربنا إلى السماء الدنيا حين يبقى ثلث الليل الآخر».',
  },
  duha: {
    id: 'duha',
    name: 'الضحى',
    icon: 'fa-solid fa-sun',
    colorClass: 'noon',
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    witr: 0,
    timeDesc: 'من ارتفاع الشمس قيد رمح إلى قبيل الزوال',
    virtues: 'قال ﷺ: «يُصبح على كل سُلامى من أحدكم صدقة... ويُجزئ عن ذلك ركعتا الضحى». وهي صلاة الأوابين.',
    sunnahDesc: 'أقلها ركعتان وأكثرها ثماني ركعات أو أكثر، تُصلى ركعتين ركعتين.',
    note: 'أفضل وقتها حين تشتد الشمس ويحمى الرمضاء.',
  },
  'shaf-witr': {
    id: 'shaf-witr',
    name: 'الشفع والوتر',
    icon: 'fa-solid fa-moon-stars',
    colorClass: 'night',
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    witr: 3,
    timeDesc: 'آخر صلاة الليل، قبيل الفجر',
    virtues: 'قال ﷺ: «الوتر حق على كل مسلم». وهو خاتم صلاة الليل وختامها.',
    sunnahDesc: 'الشفع ركعتان يُسلّم منهما، ثم الوتر ركعة واحدة. ويجوز الوتر بـ3 أو 5 أو 7 أو 11 ركعة.',
    note: 'من خشي أن لا يقوم آخر الليل فليوتر أوله، ومن طمع في القيام فليوتر آخره.',
  },
};

@Component({
  selector: 'app-prayer-detail',
  imports: [],
  templateUrl: './prayer-detail.html',
  styleUrl: './prayer-detail.scss',
})
export class PrayerDetail {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  private paramId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id') ?? ''))
  );

  prayer = computed<PrayerInfo | null>(() => PRAYERS[this.paramId() ?? ''] ?? null);

  goBack() { this.router.navigate(['/today']); }
}
