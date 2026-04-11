import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sportStrip = [
    { iconClass: 'fas fa-futbol', icon: '', name: 'Football' },
    { iconClass: 'fas fa-hand-paper', icon: '', name: 'Handball' },
    { iconClass: 'fas fa-dumbbell', icon: '', name: 'Gym' },
    { iconClass: 'fas fa-basketball-ball', icon: '', name: 'Basket' },
    { iconClass: 'fas fa-heartbeat', icon: '', name: 'Fitness' },
    { iconClass: 'fas fa-futbol', icon: '', name: 'Football' },
    { iconClass: 'fas fa-hand-paper', icon: '', name: 'Handball' },
    { iconClass: 'fas fa-dumbbell', icon: '', name: 'Gym' },
    { iconClass: 'fas fa-basketball-ball', icon: '', name: 'Basket' },
    { iconClass: 'fas fa-heartbeat', icon: '', name: 'Fitness' },
  ];

  stats = [
    { icon: 'fas fa-trophy', value: '12+', label: 'Annees d excellence' },
    { icon: 'fas fa-users', value: '3,400+', label: 'Athletes entraines' },
    { icon: 'fas fa-graduation-cap', value: '85+', label: 'Coachs experts' },
    { icon: 'fas fa-globe', value: '28', label: 'Pays representes' },
    { icon: 'fas fa-medal', value: '210+', label: 'Titres remportes' },
    { icon: 'fas fa-star', value: '4.9/5', label: 'Note moyenne' },
  ];

  pillars = [
    { icon: 'fas fa-bullseye', title: 'Methodologie elite', desc: 'Des programmes d entrainement bases sur la science, affines par plus de 10 ans de coaching professionnel.' },
    { icon: 'fas fa-chart-line', title: 'Pilote par les donnees', desc: 'Analyse de performance en temps reel et suivi biomecanique pour chaque athlete.' },
    { icon: 'fas fa-globe-americas', title: 'Reseau international', desc: 'Connectez-vous avec des coachs d elite et des athletes issus de plus de 28 pays.' },
    { icon: 'fas fa-award', title: 'Resultats prouves', desc: 'Nos athletes excellent regulierement en competitions regionales et internationales.' },
  ];

  programs = [
    {
      icon: 'assets/img/specialities/specialities-01.png',
      title: 'Maitrise du golf',
      desc: 'Un programme complet du golf: strategie de parcours, mecanique du swing et mental de competition.',
      level: 'Tous niveaux',
      duration: '8 semaines',
      spots: 12,
      accent: '#39f0ff',
      featured: true
    },
    {
      icon: 'assets/img/specialities/specialities-02.png',
      title: 'Force et conditionnement',
      desc: 'Developpez puissance explosive, endurance et qualites athletiques specifiques avec nos coachs experts.',
      level: 'Intermediaire',
      duration: '10 semaines',
      spots: 8,
      accent: '#4f7dff',
    },
    {
      icon: 'assets/img/specialities/specialities-03.png',
      title: 'Performance athletique',
      desc: 'Vitesse, agilite et coordination, avec des seances concues par d anciens athletes professionnels.',
      level: 'Avance',
      duration: '6 semaines',
      spots: 10,
      accent: '#66b7ff',
    },
    {
      icon: 'assets/img/specialities/specialities-04.png',
      title: 'Sports de raquette',
      desc: 'Programmes tennis et badminton couvrant technique, tactique et preparation a la competition.',
      level: 'Debutant',
      duration: '12 semaines',
      spots: 15,
      accent: '#7f95ff',
    },
    {
      icon: 'assets/img/specialities/specialities-05.png',
      title: 'Coaching prive',
      desc: 'Seances individuelles sur mesure avec un coach dedie, 100 pourcent centrees sur vos objectifs.',
      level: 'Tous niveaux',
      duration: 'En continu',
      spots: 5,
      accent: '#55d6ff',
    },
    {
      icon: 'assets/img/specialities/specialities-01.png',
      title: 'Academie jeunes',
      desc: 'Des programmes adaptes a l age pour faire grandir les jeunes talents dans un cadre structure et motivant.',
      level: 'Jeunes (8-16)',
      duration: '16 semaines',
      spots: 20,
      accent: '#b6e8ff',
    },
  ];

  whyList = [
    'Installations de niveau olympique sur 3 sites',
    'Coachs certifies avec plus de 10 ans d experience',
    'Plans d entrainement personnalises pilotes par l IA',
    'Horaires flexibles: matin, soir et week-end',
    'Suivi des progres avec rapports mensuels',
    'Evenements communautaires, tournois et ligues',
    'Coaching nutrition et recuperation inclus',
    'Analyse video et evaluation biomecanique',
  ];

  whyFeatures = [
    { icon: 'fas fa-dumbbell', title: 'Installations premium', desc: 'Terrains, pistes et centres d entrainement de niveau international.', color: '#39f0ff' },
    { icon: 'fas fa-chart-bar', title: 'Analyse de performance IA', desc: 'Une technologie de pointe qui suit chaque indicateur de progression.', color: '#4f7dff' },
    { icon: 'fas fa-user-shield', title: 'Mentorat expert', desc: 'Apprenez directement avec d anciens sportifs professionnels.', color: '#66b7ff' },
    { icon: 'fas fa-globe-americas', title: 'Communaute internationale', desc: 'Entrainez-vous avec des athletes venant de 28 pays et plus.', color: '#7f95ff' },
    { icon: 'fas fa-heartbeat', title: 'Cadre securise et structure', desc: 'Programmes encadres pour tous les niveaux de forme physique.', color: '#55d6ff' },
    { icon: 'fas fa-trophy', title: 'Resultats mesurables', desc: 'Progression mesurable, sinon nous ajustons votre plan.', color: '#b6e8ff' },
  ];

  coaches = [
    {
      img: 'assets/img/coaches/c1.jpg',
      name: 'Marcus Rivera',
      role: 'Responsable performance',
      sport: 'Athletisme',
      rating: 5
    },
    {
      img: 'assets/img/coaches/c2.jpg',
      name: 'Sophie Laurent',
      role: 'Directrice golf',
      sport: 'Golf',
      rating: 5
    },
    {
      img: 'assets/img/coaches/c3.jpg',
      name: 'James Okafor',
      role: 'Coach force',
      sport: 'Fitness',
      rating: 5
    },
    {
      img: 'assets/img/coaches/c4.jpg',
      name: 'Leila Mansour',
      role: 'Specialiste raquette',
      sport: 'Tennis',
      rating: 5
    },
  ];

  sessions = [
    {
      sport: 'Golf',
      level: 'Avance',
      title: 'Stage intensif golf competition',
      coach: 'Sophie Laurent',
      date: 'Lun, Mer, Ven',
      time: '07:00 - 09:00',
      location: 'Parcours de golf A',
      slots: 12,
      fillPct: 75,
      gradient: 'linear-gradient(135deg, #39f0ff22, #4f7dff22)'
    },
    {
      sport: 'Fitness',
      level: 'Intermediaire',
      title: 'Force et puissance elite',
      coach: 'James Okafor',
      date: 'Mar, Jeu, Sam',
      time: '06:00 - 08:00',
      location: 'Salle performance',
      slots: 8,
      fillPct: 90,
      gradient: 'linear-gradient(135deg, #4f7dff22, #66b7ff22)'
    },
    {
      sport: 'Athletisme',
      level: 'Debutant',
      title: 'Bootcamp vitesse et agilite',
      coach: 'Marcus Rivera',
      date: 'Lun, Jeu',
      time: '17:30 - 19:30',
      location: 'Piste d athletisme',
      slots: 15,
      fillPct: 50,
      gradient: 'linear-gradient(135deg, #7f95ff22, #39f0ff22)'
    },
  ];

  blogPosts = [
    {
      img: 'assets/img/blog/blog-01.jpg',
      category: 'Performance',
      date: '10 dec. 2024',
      readTime: '5 min de lecture',
      title: 'La science derriere la performance de haut niveau',
      excerpt: 'Decouvrez comment la science du sport et l analyse de donnees transforment l entrainement et la recuperation.',
      author: 'Marcus Rivera',
      authorImg: 'assets/img/coaches/c1.jpg'
    },
    {
      img: 'assets/img/blog/blog-02.jpg',
      category: 'Nutrition',
      date: '5 dec. 2024',
      readTime: '4 min de lecture',
      title: 'Nutrition des champions: le guide complet',
      excerpt: 'Des apports avant l effort aux repas de recuperation: tout ce dont votre corps a besoin pour performer.',
      author: 'Sophie Laurent',
      authorImg: 'assets/img/coaches/c2.jpg'
    },
    {
      img: 'assets/img/blog/blog-03.jpg',
      category: 'Mental',
      date: '28 nov. 2024',
      readTime: '6 min de lecture',
      title: 'Mental de champion: renforcer sa resilience',
      excerpt: 'Les meilleurs athletes maitrisent la resilience mentale. Voici comment la developper avec des methodes prouvees.',
      author: 'James Okafor',
      authorImg: 'assets/img/coaches/c3.jpg'
    },
  ];

  testimonialOptions = {
    nav: true,
    items: 1,
    autoplay: true,
    loop: true,
    autoplayTimeout: 5000,
    navText: [
      "<i class='fas fa-arrow-left'></i>",
      "<i class='fas fa-arrow-right'></i>"
    ],
  };

  testimonialslides = [
    {
      img: 'assets/img/clients/client2.jpg',
      name: 'Sarah Thompson',
      country: 'Royaume-Uni',
      desc: 'Rejoindre cette academie a ete la meilleure decision de ma carriere sportive. Les coachs sont excellents et les installations sont exceptionnelles.'
    },
    {
      img: 'assets/img/clients/client2.jpg',
      name: 'Ahmed Al-Rashid',
      country: 'EAU',
      desc: 'L approche personnalisee du coaching ici est unique. Mon handicap au golf a baisse de 8 coups en une saison grace a leur methode basee sur les donnees.'
    },
    {
      img: 'assets/img/clients/client2.jpg',
      name: 'Elena Petrova',
      country: 'Russie',
      desc: 'En 6 mois, je suis passee de debutante a sportive competitive. Les programmes structures, les coachs experts et la communaute m ont enormement aidee.'
    },
  ];

  constructor() { }

  ngOnInit(): void { }

}
