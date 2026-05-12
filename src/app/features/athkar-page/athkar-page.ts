import { Component, signal } from '@angular/core';
import { AthkarCard } from '../../shared/components/athkar-card/athkar-card';
import { ThekerDetails } from '../../shared/components/theker-details/theker-details';

// ── Data Models ──────────────────────────────────────────────────
export interface Theker {
  id: string;
  text: string;         // Arabic text of the theker
  hint: string;         // Hint / translation / virtue
  repeats: number;      // How many times to repeat
}

export interface AthkarCategory {
  id: string;
  title: string;
  icon: string;         // Font Awesome class
  color: string;        // CSS custom property key e.g. 'morning'
  timeLabel: string;    // e.g. 'بعد صلاة الفجر'
  description: string;  // Short paragraph shown on the card
  athkar: Theker[];
}

@Component({
  selector: 'app-athkar-page',
  imports: [AthkarCard, ThekerDetails],
  templateUrl: './athkar-page.html',
  styleUrl: './athkar-page.scss',
})
export class AthkarPage {

  // ── Hero particles ─────────────────────────────────────────────
  particles = Array.from({ length: 15 }, (_, i) => i);

  // ── State ──────────────────────────────────────────────────────
  activeCategory = signal<AthkarCategory | null>(null);

  openCategory(cat: AthkarCategory) {
    this.activeCategory.set(cat);
  }

  closeDetails() {
    this.activeCategory.set(null);
  }

  // ── Athkar Data ────────────────────────────────────────────────
  categories: AthkarCategory[] = [
    {
      id: 'morning',
      title: 'أذكار الصباح',
      icon: 'fa-solid fa-sun',
      color: 'morning',
      timeLabel: 'بعد صلاة الفجر حتى الضحى',
      description: 'أذكار تُقال في الصباح لحفظ اليوم وتحصيل البركة والعافية.',
      athkar: [
        {
          id: 'morning-1',
          text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          hint: 'رواه مسلم — يُقال مرة واحدة في الصباح.',
          repeats: 1,
        },
        {
          id: 'morning-2',
          text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.',
          hint: 'رواه الترمذي — دعاء الاستفتاح بالصباح.',
          repeats: 1,
        },
        {
          id: 'morning-3',
          text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
          hint: 'رواه مسلم — من قالها مئة مرة غُفرت ذنوبه وإن كانت مثل زبد البحر.',
          repeats: 100,
        },
        {
          id: 'morning-4',
          text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          hint: 'رواه البخاري ومسلم — يعدل عتق أربعة أنفس من ولد إسماعيل.',
          repeats: 10,
        },
        {
          id: 'morning-5',
          text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ.',
          hint: 'رواه أبو داود وابن ماجه — سيد الدعاء.',
          repeats: 1,
        },
      ],
    },
    {
      id: 'evening',
      title: 'أذكار المساء',
      icon: 'fa-solid fa-moon',
      color: 'evening',
      timeLabel: 'بعد صلاة العصر حتى المغرب',
      description: 'أذكار تُقال في المساء لختم النهار بالحمد والاستعاذة.',
      athkar: [
        {
          id: 'evening-1',
          text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          hint: 'رواه مسلم — مرادف ذكر الصباح ولكن في المساء.',
          repeats: 1,
        },
        {
          id: 'evening-2',
          text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.',
          hint: 'رواه الترمذي — خاتمة اليوم بتوكيد التوحيد.',
          repeats: 1,
        },
        {
          id: 'evening-3',
          text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
          hint: 'رواه مسلم — من قالها ثلاثاً لم تضره حمة تلك الليلة.',
          repeats: 3,
        },
        {
          id: 'evening-4',
          text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
          hint: 'رواه الترمذي وأبو داود — من قالها ثلاثاً لم تصبه فجأة بلاء.',
          repeats: 3,
        },
      ],
    },
    {
      id: 'sleep',
      title: 'أذكار النوم',
      icon: 'fa-solid fa-bed',
      color: 'sleep',
      timeLabel: 'عند النوم',
      description: 'أذكار تُقال قبيل النوم للحفظ والطمأنينة طوال الليل.',
      athkar: [
        {
          id: 'sleep-1',
          text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.',
          hint: 'رواه البخاري — يُقال عند الاستلقاء للنوم.',
          repeats: 1,
        },
        {
          id: 'sleep-2',
          text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.',
          hint: 'رواه أبو داود — من قالها ثلاثاً حفظه الله من عذاب القبر.',
          repeats: 3,
        },
        {
          id: 'sleep-3',
          text: 'سُبْحَانَ اللَّهِ.',
          hint: 'رواه البخاري ومسلم — يُقال ثلاثاً وثلاثين مرة قبل النوم.',
          repeats: 33,
        },
        {
          id: 'sleep-4',
          text: 'الْحَمْدُ لِلَّهِ.',
          hint: 'يُقال ثلاثاً وثلاثين مرة.',
          repeats: 33,
        },
        {
          id: 'sleep-5',
          text: 'اللَّهُ أَكْبَرُ.',
          hint: 'يُقال أربعاً وثلاثين مرة — مجموعها مئة.',
          repeats: 34,
        },
      ],
    },
    {
      id: 'wakeup',
      title: 'أذكار الاستيقاظ',
      icon: 'fa-solid fa-cloud-sun',
      color: 'wakeup',
      timeLabel: 'عند الاستيقاظ من النوم',
      description: 'أذكار تُقال لحظة الاستيقاظ شكراً لله على نعمة الحياة.',
      athkar: [
        {
          id: 'wakeup-1',
          text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.',
          hint: 'رواه البخاري — أول ما يُقال عند الاستيقاظ.',
          repeats: 1,
        },
        {
          id: 'wakeup-2',
          text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.',
          hint: 'رواه البخاري — ثم ليقل اللهم اغفر لي.',
          repeats: 1,
        },
      ],
    },
    {
      id: 'prayer',
      title: 'أذكار بعد الصلاة',
      icon: 'fa-solid fa-star-and-crescent',
      color: 'prayer',
      timeLabel: 'عقب كل صلاة مكتوبة',
      description: 'أذكار السنة المؤكدة التي تُقال في أعقاب كل صلاة فريضة.',
      athkar: [
        {
          id: 'prayer-1',
          text: 'أَسْتَغْفِرُ اللَّهَ.',
          hint: 'رواه مسلم — يُقال ثلاثاً بعد السلام مباشرة.',
          repeats: 3,
        },
        {
          id: 'prayer-2',
          text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.',
          hint: 'رواه مسلم — يُقال مرة واحدة بعد الاستغفار.',
          repeats: 1,
        },
        {
          id: 'prayer-3',
          text: 'سُبْحَانَ اللَّهِ.',
          hint: 'رواه مسلم — ثلاثاً وثلاثين مرة.',
          repeats: 33,
        },
        {
          id: 'prayer-4',
          text: 'الْحَمْدُ لِلَّهِ.',
          hint: 'ثلاثاً وثلاثين مرة.',
          repeats: 33,
        },
        {
          id: 'prayer-5',
          text: 'اللَّهُ أَكْبَرُ.',
          hint: 'أربعاً وثلاثين مرة — مجموعها مئة.',
          repeats: 34,
        },
        {
          id: 'prayer-6',
          text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
          hint: 'رواه مسلم — تُغفر خطاياه وإن كانت مثل زبد البحر.',
          repeats: 1,
        },
        {
          id: 'prayer-7',
          text: 'آيَةُ الْكُرْسِيِّ.',
          hint: 'رواه النسائي — من قرأها دبر كل صلاة لم يحل بينه وبين الجنة إلا الموت.',
          repeats: 1,
        },
      ],
    },
    {
      id: 'quran',
      title: 'أذكار القرآن',
      icon: 'fa-solid fa-book-open',
      color: 'quran',
      timeLabel: 'في أي وقت',
      description: 'أذكار وأدعية مأثورة بالتلاوة والاستعاذة والتسبيح من القرآن الكريم.',
      athkar: [
        {
          id: 'quran-1',
          text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ.',
          hint: 'سورة النحل: 98 — تُقال قبل التلاوة.',
          repeats: 1,
        },
        {
          id: 'quran-2',
          text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ.',
          hint: 'تُقال في بداية كل سورة ما عدا سورة التوبة.',
          repeats: 1,
        },
        {
          id: 'quran-3',
          text: 'صَدَقَ اللَّهُ الْعَظِيمُ.',
          hint: 'تُقال بعد الانتهاء من التلاوة تعظيماً لكلام الله.',
          repeats: 1,
        },
      ],
    },
  ];
}
