<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToRegister = () => {
  router.push('/register');
};

const features = ref([
  {
    title: 'Gérez facilement vos membres',
    description: 'Invitations, suivi et validation en un clic.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: 'Organisez vos activités sans stress',
    description: 'Planifiez, suivez les inscriptions et gérez les paiements.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Boostez votre communication',
    description: 'Annonces, notifications, emails et campagnes SMS intégrés.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  },
  {
    title: 'Optimisez vos finances',
    description: 'Gestion des cotisations et reporting simplifié.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]);

const testimonials = ref([
  {
    name: 'Sophie L.',
    role: 'Responsable d\'association',
    content: 'Grâce à HubGroupes, la gestion de notre association est devenue un jeu d\'enfant ! Plus de stress, tout est automatisé.',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    name: 'Thomas M.',
    role: 'Président de club sportif',
    content: 'Nous avons gagné un temps précieux dans la gestion des cotisations et l\'organisation des événements. Je recommande vivement !',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Marie D.',
    role: 'Trésorière de comité',
    content: 'Le suivi financier est devenu simple et transparent. Les rapports générés nous font gagner des heures de travail chaque mois.',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
  }
]);

// Données pour le formulaire de contact
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitContactForm = () => {
  // Ici, vous pourriez implémenter l'envoi du formulaire à un backend
  console.log('Formulaire de contact soumis:', contactForm.value);
  // Réinitialiser le formulaire après soumission
  contactForm.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  // Afficher un message de confirmation (à implémenter)
  alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
};

// Données pour la newsletter
const newsletterEmail = ref('');

const subscribeToNewsletter = () => {
  // Ici, vous pourriez implémenter l'inscription à la newsletter
  console.log('Inscription à la newsletter:', newsletterEmail.value);
  // Réinitialiser l'email après soumission
  newsletterEmail.value = '';
  // Afficher un message de confirmation (à implémenter)
  alert('Merci pour votre inscription à notre newsletter !');
};
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 md:pr-12 mb-10 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
            Simplifiez la gestion de votre communauté
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            HubGroupes est la solution tout-en-un pour gérer efficacement vos membres, activités, communications et
            finances.
          </p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button @click="navigateToRegister"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
              Commencer gratuitement
            </button>
            <a href="#features"
              class="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-indigo-600 font-medium py-3 px-6 rounded-lg border border-indigo-200 shadow-sm transition duration-300 ease-in-out">
              <span>En savoir plus</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div class="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            alt="Dashboard HubGroupes" class="rounded-lg shadow-xl" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Pourquoi choisir HubGroupes ?</h2>
        <p class="text-center text-gray-600 mb-12">Une solution complète pour gérer tous les aspects de votre communauté
        </p>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" :key="index"
            class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-900">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-indigo-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">HubGroupes en chiffres</h2>
        <p class="text-center text-gray-600 mb-12">Notre plateforme aide des milliers d'organisations à travers le monde
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl font-bold text-indigo-600 mb-2">5000+</div>
            <p class="text-gray-600">Communautés actives</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl font-bold text-indigo-600 mb-2">250K+</div>
            <p class="text-gray-600">Membres gérés</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl font-bold text-indigo-600 mb-2">45K+</div>
            <p class="text-gray-600">Événements organisés</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-4xl font-bold text-indigo-600 mb-2">98%</div>
            <p class="text-gray-600">Taux de satisfaction</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demonstration Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 class="text-3xl font-bold mb-6 text-gray-900">Découvrez HubGroupes en action !</h2>
            <p class="text-lg text-gray-600 mb-8">
              Une interface moderne et intuitive conçue pour vous simplifier la gestion de votre communauté.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Tableau de bord personnalisable</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Gestion des membres simplifiée</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Planification d'activités intuitive</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Suivi financier en temps réel</span>
              </li>
            </ul>
          </div>
          <div class="md:w-1/2 md:pl-6">
            <div class="rounded-lg shadow-xl overflow-hidden">
              <img src="../assets/images/interface.jpg" alt="Interface HubGroupes" class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">Ce que disent nos utilisateurs</h2>
        <p class="text-center text-gray-600 mb-12">Rejoignez plus de 5 000 communautés qui font confiance à HubGroupes
        </p>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index"
            class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.name"
                class="w-14 h-14 rounded-full mr-4 border-2 border-indigo-100" />
              <div>
                <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <p class="text-gray-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.content }}"</p>
          </div>
        </div>

        <div class="mt-16 flex flex-wrap justify-center gap-10">
          <img src="@/assets/images/client-logo1.jpg" alt="Client Logo"
            class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo2.jpg" alt="Client Logo"
            class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo3.jpg" alt="Client Logo"
            class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo1.jpg" alt="Client Logo"
            class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 class="text-3xl font-bold mb-6 text-gray-900">À propos de HubGroupes</h2>
            <p class="text-lg text-gray-600 mb-6">
              Fondée en 2023, HubGroupes est née d'une vision simple : simplifier la gestion des communautés pour
              permettre aux organisateurs de se concentrer sur ce qui compte vraiment - créer des liens et avoir un
              impact positif.
            </p>
            <p class="text-lg text-gray-600 mb-6">
              Notre mission est de fournir aux associations, clubs et organisations communautaires les outils
              technologiques dont ils ont besoin pour prospérer dans un monde de plus en plus connecté.
            </p>
            <p class="text-lg text-gray-600">
              Avec des clients dans plus de 30 pays, nous sommes fiers de contribuer au succès de milliers de
              communautés à travers le monde.
            </p>
          </div>
          <div class="md:w-1/2">
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-lg overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Équipe HubGroupes" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-lg overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Bureau HubGroupes" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-lg overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Collaboration" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-lg overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Innovation" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">Notre équipe</h2>
        <p class="text-center text-gray-600 mb-12">Des experts passionnés par la technologie et l'impact communautaire
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Thomas Dubois"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100" />
            <h3 class="text-xl font-semibold mb-1">Thomas Dubois</h3>
            <p class="text-indigo-600 mb-3">Fondateur & CEO</p>
            <p class="text-gray-600 mb-4">Passionné par la technologie au service des communautés.</p>
            <div class="flex justify-center space-x-3">
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                  </path>
                </svg>
              </a>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Marie Laurent"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100" />
            <h3 class="text-xl font-semibold mb-1">Marie Laurent</h3>
            <p class="text-indigo-600 mb-3">Directrice Technique</p>
            <p class="text-gray-600 mb-4">Experte en développement et architecture logicielle.</p>
            <div class="flex justify-center space-x-3">
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                  </path>
                </svg>
              </a>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Paul Moreau"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100" />
            <h3 class="text-xl font-semibold mb-1">Paul Moreau</h3>
            <p class="text-indigo-600 mb-3">Directeur Marketing</p>
            <p class="text-gray-600 mb-4">Spécialiste en croissance et acquisition clients.</p>
            <div class="flex justify-center space-x-3">
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                  </path>
                </svg>
              </a>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <img src="https://randomuser.me/api/portraits/women/4.jpg" alt="Sophie Petit"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100" />
            <h3 class="text-xl font-semibold mb-1">Sophie Petit</h3>
            <p class="text-indigo-600 mb-3">Responsable Client</p>
            <p class="text-gray-600 mb-4">Dédiée à la satisfaction et au succès de nos clients.</p>
            <div class="flex justify-center space-x-3">
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                  </path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">Contactez-nous</h2>
        <p class="text-center text-gray-600 mb-12">Nous sommes là pour répondre à toutes vos questions</p>

        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <div class="bg-white p-8 rounded-lg shadow-sm">
              <form @submit.prevent="submitContactForm">
                <div class="mb-6">
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input type="text" id="name" v-model="contactForm.name"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre nom" />
                </div>
                <div class="mb-6">
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" id="email" v-model="contactForm.email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="votre@email.com" />
                </div>
                <div class="mb-6">
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <select id="subject" v-model="contactForm.subject"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="support">Support technique</option>
                    <option value="billing">Facturation</option>
                    <option value="partnership">Partenariat</option>
                  </select>
                </div>
                <div class="mb-6">
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="message" v-model="contactForm.message" rows="5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre message..."></textarea>
                </div>
                <button type="submit"
                  class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-300">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>

          <div>
            <div class="bg-gray-50 p-8 rounded-lg shadow-sm h-full">
              <h3 class="text-xl font-semibold mb-6 text-gray-900">Informations de contact</h3>

              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                      </path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-900 font-medium">Téléphone</p>
                    <p class="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                      </path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-900 font-medium">Email</p>
                    <p class="text-gray-600">contact@hubgroupes.com</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-900 font-medium">Adresse</p>
                    <p class="text-gray-600">123 Avenue de l'Innovation<br />75001 Paris, France</p>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <h4 class="text-lg font-medium mb-4 text-gray-900">Suivez-nous</h4>
                <div class="flex space-x-4">
                  <a href="#" class="text-gray-400 hover:text-indigo-600">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z">
                      </path>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-indigo-600">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                      </path>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-indigo-600">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                      </path>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-indigo-600">
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                      </path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
          <div class="px-6 py-12 sm:px-12 lg:px-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 class="text-3xl font-bold text-white mb-4">Inscrivez-vous à notre newsletter</h2>
                <p class="text-indigo-100 mb-6">Recevez nos dernières actualités, conseils et offres spéciales
                  directement dans votre boîte mail.</p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <input type="email" v-model="newsletterEmail" placeholder="Votre adresse email"
                    class="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                  <button @click="subscribeToNewsletter"
                    class="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium shadow-sm transition duration-300 whitespace-nowrap">
                    S'inscrire
                  </button>
                </div>
                <p class="text-indigo-200 text-sm mt-3">Nous respectons votre vie privée. Désabonnez-vous à tout moment.
                </p>
              </div>
              <div class="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Newsletter" class="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier la gestion de votre communauté ?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Rejoignez des milliers d'organisations qui ont transformé leur façon
          de gérer leurs communautés.</p>
        <button @click="navigateToRegister"
          class="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 text-lg">
          Essayez HubGroupes gratuitement dès maintenant !
        </button>
        <p class="mt-4 text-indigo-200">Aucune carte de crédit requise • Annulez à tout moment</p>
      </div>
    </section>
  </main>
</template>
