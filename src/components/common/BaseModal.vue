<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'submit']);

const modalRef = ref(null);
const modalContentRef = ref(null);

const handleClickOutside = (event) => {
  if (props.closeOnClickOutside && modalRef.value && !modalContentRef.value.contains(event.target)) {
    emit('close');
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && props.show) {
    emit('close');
  }
};

const preventScroll = () => {
  document.body.style.overflow = 'hidden';
};

const allowScroll = () => {
  document.body.style.overflow = '';
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    preventScroll();
    document.addEventListener('keydown', handleEscapeKey);
  } else {
    allowScroll();
    document.removeEventListener('keydown', handleEscapeKey);
  }
});

onMounted(() => {
  if (props.show) {
    preventScroll();
    document.addEventListener('keydown', handleEscapeKey);
  }
});

onBeforeUnmount(() => {
  allowScroll();
  document.removeEventListener('keydown', handleEscapeKey);
});

const close = () => {
  emit('close');
};

const submit = () => {
  emit('submit');
};

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" ref="modalRef" @click="handleClickOutside"
        class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div ref="modalContentRef" 
          :class="['bg-white rounded-lg shadow-xl w-full transform transition-all', sizeClasses[size]]">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <button @click="close" type="button"
              class="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <slot name="footer">
              <button @click="close" type="button"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Annuler
              </button>
              <button @click="submit" type="button"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Confirmer
              </button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
