<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Ajouter...'
  },
  allowNew: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');
const isDropdownOpen = ref(false);
const inputRef = ref(null);

const filteredOptions = computed(() => {
  if (!inputValue.value) return props.options;
  
  const searchTerm = inputValue.value.toLowerCase();
  return props.options.filter(option => 
    option.toLowerCase().includes(searchTerm) && 
    !props.modelValue.includes(option)
  );
});

const addTag = (tag) => {
  if (!tag || props.modelValue.includes(tag)) return;
  
  const newTags = [...props.modelValue, tag];
  emit('update:modelValue', newTags);
  inputValue.value = '';
  isDropdownOpen.value = false;
};

const removeTag = (index) => {
  const newTags = [...props.modelValue];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
};

const handleKeydown = (e) => {
  // Si l'utilisateur appuie sur Entrée
  if (e.key === 'Enter' && inputValue.value) {
    e.preventDefault();
    
    // Si l'option existe déjà dans la liste déroulante, l'ajouter
    const existingOption = filteredOptions.value.find(
      option => option.toLowerCase() === inputValue.value.toLowerCase()
    );
    
    if (existingOption) {
      addTag(existingOption);
    } else if (props.allowNew) {
      // Si allowNew est true, ajouter la nouvelle valeur
      addTag(inputValue.value);
    }
  } else if (e.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    // Si l'utilisateur appuie sur Backspace et que l'input est vide, supprimer le dernier tag
    removeTag(props.modelValue.length - 1);
  }
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  // Fermer la liste déroulante après un court délai pour permettre la sélection
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 150);
};

watch(inputValue, (newValue) => {
  if (newValue) {
    openDropdown();
  }
});

// Fermer la liste déroulante lorsqu'on clique à l'extérieur
const handleClickOutside = (event) => {
  if (inputRef.value && !inputRef.value.contains(event.target)) {
    closeDropdown();
  }
};

// Ajouter et supprimer les écouteurs d'événements
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="inputRef">
    <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
      <!-- Tags existants -->
      <span v-for="(tag, index) in modelValue" :key="index" 
        class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
        {{ tag }}
        <button type="button" @click="removeTag(index)" class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none">
          <span class="sr-only">Supprimer</span>
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
      
      <!-- Input pour ajouter de nouveaux tags -->
      <input
        type="text"
        v-model="inputValue"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        @focus="openDropdown"
        @blur="closeDropdown"
        @keydown="handleKeydown"
        class="flex-grow min-w-[120px] outline-none border-none p-0.5 text-sm"
      />
    </div>
    
    <!-- Liste déroulante des options -->
    <div v-if="isDropdownOpen && filteredOptions.length > 0" 
      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
      <div v-for="option in filteredOptions" :key="option" 
        @mousedown="addTag(option)"
        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50">
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
