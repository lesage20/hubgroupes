<template>
    <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            <strong class="font-bold">Erreur !</strong>
            <span class="block sm:inline"> {{ error }}</span>
        </div>

        <div v-else>
            <!-- Contenu de la communauté -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <!-- Image de couverture et logo -->
                <div class="relative">
                    <!-- Image de couverture -->
                    <div class="h-48 md:h-64 w-full bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
                        <img v-if="community.cover_image" :src="community.cover_image" alt="Couverture de la communauté"
                            class="w-full h-full object-cover opacity-90" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white opacity-30" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Logo de la communauté -->
                    <div class="absolute -bottom-12 left-6 md:left-8">
                        <div
                            class="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                            <img v-if="community.logo" :src="community.logo" alt="Logo de la communauté"
                                class="w-full h-full object-cover" />
                            <div v-else
                                class="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-xl font-bold">
                                {{ getInitials(community.label) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Informations de la communauté -->
                <div class="pt-16 pb-6 px-6 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row justify-between items-start">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">{{ community.label }}</h1>
                            <div class="flex items-center mt-2 space-x-4">
                                <div class="flex flex-wrap gap-1.5">
                                    <span v-for="(tag, index) in communityTags" :key="index"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="getTagColor(index)">
                                        {{ tag.trim() }}
                                    </span>
                                </div>
                                <span class="text-sm text-gray-500 ml-2">
                                    {{ community.member_count || members.length }} membres
                                </span>
                                <span class="text-sm text-gray-500">
                                    Créée le {{ formatDate(community.created_at) }}
                                </span>
                            </div>
                            <p class="mt-3 text-gray-600">{{ community.short_description }}</p>

                            <!-- Réseaux sociaux -->
                            <div v-if="community.social_links" class="mt-4 flex space-x-4">
                                <a v-if="community.social_links.facebook" :href="community.social_links.facebook"
                                    target="_blank" class="text-gray-400 hover:text-blue-600">
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <a v-if="community.social_links.twitter" :href="community.social_links.twitter"
                                    target="_blank" class="text-gray-400 hover:text-blue-400">
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a v-if="community.social_links.instagram" :href="community.social_links.instagram"
                                    target="_blank" class="text-gray-400 hover:text-pink-600">
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </a>
                                <a v-if="community.social_links.linkedin" :href="community.social_links.linkedin"
                                    target="_blank" class="text-gray-400 hover:text-blue-700">
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a v-if="community.whatsapp" :href="`https://wa.me/${community.whatsapp}`"
                                    target="_blank" class="text-gray-400 hover:text-green-600">
                                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Boutons d'action -->
                        <div class="mt-4 md:mt-0 flex flex-col space-y-2">
                            <BaseButton v-if="!isMember" variant="primary" :loading="isJoining" @click="joinCommunity">
                                Rejoindre la communauté
                            </BaseButton>
                            <BaseButton v-else-if="!isOwner" variant="secondary" :loading="isLeaving"
                                @click="leaveCommunity">
                                Quitter la communauté
                            </BaseButton>
                            <BaseButton v-if="isOwner || isModerator" variant="secondary"
                                @click="router.push({ name: 'community-edit', params: { id: community.id } })">
                                Modifier la communauté
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- Navigation par onglets -->
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button @click="activeTab = 'about'" :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'about' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        ]">
                            À propos
                        </button>
                        <button @click="activeTab = 'members'" :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        ]">
                            Membres
                        </button>
                        <button @click="activeTab = 'activities'" :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'activities' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        ]">
                            Activités
                        </button>
                    </nav>
                </div>

                <!-- Contenu des onglets -->
                <div class="p-6">
                    <!-- Onglet À propos -->
                    <div v-if="activeTab === 'about'">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
                        <p class="text-gray-600">{{ community.description }}</p>
                    </div>

                    <!-- Onglet Membres -->
                    <div v-if="activeTab === 'members'">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-900">Liste des membres</h3>
                            <div class="flex space-x-2">
                                <input 
                                    v-model="memberSearchQuery" 
                                    type="text" 
                                    placeholder="Rechercher un membre..." 
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div v-if="members.length > 0">
                            <!-- Tableau des membres -->
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Membre
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rôle
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date d'inscription
                                            </th>
                                            <th v-if="isOwner || isModerator" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div v-if="member.User.profile_picture" class="h-10 w-10 rounded-full overflow-hidden">
                                                            <img :src="member.User.profile_picture" alt="Photo de profil" class="h-full w-full object-cover" />
                                                        </div>
                                                        <div v-else class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span class="text-sm font-medium text-indigo-600">
                                                                {{ getInitials(member.User.first_name + ' ' + member.User.last_name) }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-gray-900">
                                                            {{ member.User.first_name }} {{ member.User.last_name }}
                                                        </div>
                                                        <div class="text-sm text-gray-500">
                                                            {{ member.User.phone_number || 'Pas de téléphone' }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{{ member.User.email || 'Pas d\'email' }}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">
                                                    <a v-if="member.User.phone_number" :href="`tel:${member.User.phone_number}`" class="text-indigo-600 hover:text-indigo-900">
                                                        {{ formatPhoneNumber(member.User.phone_number) }}
                                                    </a>
                                                    <span v-else class="text-gray-500">Pas de contact</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                    :class="{
                                                        'bg-indigo-100 text-indigo-800': member.role === 'MEMBER',
                                                        'bg-blue-100 text-blue-800': member.role === 'ADMIN',
                                                        'bg-green-100 text-green-800': member.role === 'MODERATOR'
                                                    }">
                                                    {{ member.role === 'MEMBER' ? 'Membre' :
                                                        member.role === 'ADMIN' ? 'Admin' :
                                                            member.role === 'MODERATOR' ? 'Modérateur' : 'Membre' }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                    :class="getMemberStatusClass(member.status)">
                                                    {{ getMemberStatusLabel(member.status) }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ formatDate(member.register_date || member.created_at) }}
                                            </td>
                                            <td v-if="isOwner || isModerator" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button @click="openManageMemberModal(member)" class="text-indigo-600 hover:text-indigo-900">
                                                    Gérer
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <!-- Pagination -->
                            <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                <div class="flex flex-1 justify-between sm:hidden">
                                    <button @click="currentPage = Math.max(1, currentPage - 1)" 
                                        :disabled="currentPage === 1"
                                        :class="[
                                            'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                        ]">
                                        Précédent
                                    </button>
                                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                                        :disabled="currentPage === totalPages"
                                        :class="[
                                            'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                                            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                        ]">
                                        Suivant
                                    </button>
                                </div>
                                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p class="text-sm text-gray-700">
                                            Affichage de <span class="font-medium">{{ paginationStart }}</span> à <span class="font-medium">{{ paginationEnd }}</span> sur <span class="font-medium">{{ filteredMembers.length }}</span> membres
                                        </p>
                                    </div>
                                    <div>
                                        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            <button @click="currentPage = Math.max(1, currentPage - 1)" 
                                                :disabled="currentPage === 1"
                                                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                                <span class="sr-only">Précédent</span>
                                                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                            
                                            <template v-for="page in displayedPages" :key="page">
                                                <button v-if="page !== '...'" 
                                                    @click="currentPage = page" 
                                                    :class="[
                                                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                                                        currentPage === page 
                                                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                                    ]">
                                                    {{ page }}
                                                </button>
                                                <span v-else class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                                    ...
                                                </span>
                                            </template>
                                            
                                            <button @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                                                :disabled="currentPage === totalPages"
                                                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                                <span class="sr-only">Suivant</span>
                                                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8">
                            <p class="text-gray-500">Aucun membre trouvé.</p>
                        </div>
                    </div>

                    <!-- Onglet Activités -->
                    <div v-if="activeTab === 'activities'">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-900">Activités de la communauté</h3>
                        </div>

                        <!-- Événements à venir -->
                        <div v-if="upcomingEvents.length > 0" class="mb-8">
                            <h4 class="text-md font-medium text-gray-700 mb-3">Événements à venir</h4>
                            <div class="space-y-4">
                                <div v-for="event in upcomingEvents" :key="event.id"
                                    class="p-4 border rounded-md bg-blue-50">
                                    <h4 class="font-medium">{{ event.title }}</h4>
                                    <p class="text-sm text-gray-500">{{ formatDate(event.start_date) }}</p>
                                    <p class="mt-2">{{ event.description }}</p>
                                    <div class="mt-3 flex justify-end">
                                        <BaseButton variant="secondary" size="sm"
                                            @click="router.push({ name: 'activity-details', params: { id: event.id } })">
                                            Voir les détails
                                        </BaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Événements passés -->
                        <div v-if="pastEvents.length > 0">
                            <h4 class="text-md font-medium text-gray-700 mb-3">Événements passés</h4>
                            <div class="space-y-4">
                                <div v-for="event in pastEvents" :key="event.id" class="p-4 border rounded-md">
                                    <h4 class="font-medium">{{ event.title }}</h4>
                                    <p class="text-sm text-gray-500">{{ formatDate(event.start_date) }}</p>
                                    <p class="mt-2">{{ event.description }}</p>
                                    <div class="mt-3 flex justify-end">
                                        <BaseButton variant="secondary" size="sm"
                                            @click="router.push({ name: 'activity-details', params: { id: event.id } })">
                                            Voir les détails
                                        </BaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="upcomingEvents.length === 0 && pastEvents.length === 0" class="text-center py-8">
                            <p class="text-gray-500">Aucune activité pour le moment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modales -->
    <BaseModal v-if="showManageMemberModal" :show="showManageMemberModal" @close="showManageMemberModal = false"
        title="Gérer le membre">
        <div v-if="selectedMember" class="p-4">
            <p class="mb-4">Gérer les permissions de {{ selectedMember.first_name }} {{ selectedMember.last_name }}</p>
            <!-- Contenu de la modale à implémenter -->
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import CommunityService from '@/services/communityService';
import MemberService from '@/services/memberService';
import ActivityService from '@/services/activityService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// État
const community = ref({});
const members = ref([]);
const upcomingEvents = ref([]);
const pastEvents = ref([]);
const isLoading = ref(true);
const error = ref(null);
const activeTab = ref('about'); // about, members, activities
const isJoining = ref(false);
const isLeaving = ref(false);
const showManageMemberModal = ref(false);
const selectedMember = ref(null);

const memberSearchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties
const isOwner = computed(() => {
    return community.value && authStore.user &&
        (community.value.owner_id === authStore.user.id ||
            community.value.creator === authStore.user.id);
});

const isMember = computed(() => {
    if (!authStore.user || !community.value.members) return false;
    return community.value.members?.some(member => member.user_id === authStore.user.id);
});

const memberRole = computed(() => {
    if (!authStore.user || !community.value.members) return null;
    const userMember = community.value.members?.find(member => member.user_id === authStore.user.id);
    return userMember ? userMember.role : null;
});

const isAdmin = computed(() => {
    return memberRole.value === 'admin';
});

const filteredMembers = computed(() => {
    if (!members.value) return [];
    
    let result = [...members.value];
    
    // Filtrer par recherche
    if (memberSearchQuery.value.trim()) {
        const query = memberSearchQuery.value.toLowerCase();
        result = result.filter(member => 
            (member.User.first_name + ' ' + member.User.last_name).toLowerCase().includes(query) ||
            (member.User.email && member.User.email.toLowerCase().includes(query)) ||
            (member.User.phone_number && member.User.phone_number.toLowerCase().includes(query))
        );
    }
    
    return result;
});

const paginatedMembers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredMembers.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredMembers.value.length / itemsPerPage);
});

const paginationStart = computed(() => {
    return filteredMembers.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
    return Math.min(currentPage.value * itemsPerPage, filteredMembers.value.length);
});

const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    if (current <= 3) {
        return [1, 2, 3, 4, '...', total];
    }
    
    if (current >= total - 2) {
        return [1, '...', total - 3, total - 2, total - 1, total];
    }
    
    return [1, '...', current - 1, current, current + 1, '...', total];
});

const communityTags = computed(() => {
    if (!community.value || !community.value.type) return [];
    // Remplacer les | par des virgules puis split par virgule
    return community.value.type.replace(/\|/g, ',').split(',').filter(tag => tag.trim() !== '');
});

// Fonction pour obtenir une couleur différente pour chaque tag
const getTagColor = (index) => {
    const colors = [
        'bg-indigo-100 text-indigo-800',
        'bg-blue-100 text-blue-800',
        'bg-green-100 text-green-800',
        'bg-yellow-100 text-yellow-800',
        'bg-red-100 text-red-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-teal-100 text-teal-800'
    ];
    return colors[index % colors.length];
};

// Fonction pour obtenir le libellé du statut du membre
const getMemberStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'Actif';
        case 'pending':
            return 'En attente';
        case 'rejected':
            return 'Rejeté';
        case 'blocked':
            return 'Bloqué';
        default:
            return 'Inconnu';
    }
};

// Fonction pour obtenir la classe CSS du statut du membre
const getMemberStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        case 'blocked':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Fonction pour formater un numéro de téléphone
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Si le numéro commence par +, on le garde tel quel
    if (phoneNumber.startsWith('+')) {
        // Format international: grouper par 2 chiffres après l'indicatif pays
        return phoneNumber.replace(/(\+\d{1,3})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    
    // Format local français: XX XX XX XX XX
    return phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

// Méthodes
const fetchCommunity = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        const communityId = route.params.id;

        // 1. Récupérer les détails de la communauté
        const communityResponse = await CommunityService.getCommunityById(communityId);
        if (communityResponse && communityResponse.data && communityResponse.data.message) {
            community.value = communityResponse.data.message;
        } else {
            throw new Error('Impossible de récupérer les détails de la communauté');
        }

        // 2. Récupérer les membres de la communauté
        const membersResponse = await MemberService.getMembers(communityId);
        if (membersResponse && membersResponse.data && membersResponse.data.data) {
            members.value = membersResponse.data.data.members;

            // Mettre à jour la liste des membres dans l'objet community
            community.value.members = members.value;
        }

        // 3. Récupérer les événements à venir de la communauté
        const upcomingEventsResponse = await ActivityService.getCommunityUpcomingEvents(communityId);
        if (upcomingEventsResponse && upcomingEventsResponse.data && upcomingEventsResponse.data.data) {
            upcomingEvents.value = upcomingEventsResponse.data.data.activities;
        }

        // 4. Récupérer les événements passés de la communauté
        const pastEventsResponse = await ActivityService.getCommunityPastEvents(communityId);
        if (pastEventsResponse && pastEventsResponse.data && pastEventsResponse.data.data) {
            pastEvents.value = pastEventsResponse.data.data.activities;
        }

    } catch (err) {
        console.error('Erreur lors de la récupération des données de la communauté:', err);
        error.value = 'Impossible de charger les données de la communauté. Veuillez réessayer plus tard.';
    } finally {
        isLoading.value = false;
    }
};

const joinCommunity = async () => {
    if (!authStore.user || !authStore.user.id) {
        router.push({ name: 'login' });
        return;
    }

    isJoining.value = true;

    try {
        const memberData = {
            community_id: community.value.id,
            user_id: authStore.user.id,
            role: 'MEMBER',
            status: 'active'
        };

        await MemberService.addMember(community.value.id, memberData);

        // Rafraîchir les données de la communauté
        await fetchCommunity();
    } catch (err) {
        console.error('Erreur lors de l\'ajout à la communauté:', err);
        error.value = 'Impossible de rejoindre la communauté. Veuillez réessayer plus tard.';
    } finally {
        isJoining.value = false;
    }
};

const leaveCommunity = async () => {
    if (!authStore.user || !authStore.user.id) return;

    isLeaving.value = true;

    try {
        await MemberService.removeMember(community.value.id, authStore.user.id);

        // Rafraîchir les données de la communauté
        await fetchCommunity();
    } catch (err) {
        console.error('Erreur lors du départ de la communauté:', err);
        error.value = 'Impossible de quitter la communauté. Veuillez réessayer plus tard.';
    } finally {
        isLeaving.value = false;
    }
};

const openManageMemberModal = (member) => {
    selectedMember.value = member;
    showManageMemberModal.value = true;
};

// Utilitaires
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }).format(date);
};

const getInitials = (label) => {
    if (!label) return 'C';
    const words = label.split(' ');
    return words.map(word => word.charAt(0).toUpperCase()).join('');
};

// Cycle de vie
onMounted(() => {
    fetchCommunity();
});

watch(memberSearchQuery, () => {
    currentPage.value = 1;
});
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
