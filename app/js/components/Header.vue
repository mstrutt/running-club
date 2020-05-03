<script>
  import User from './User';

  export default {
    components: {
      User
    }
  }
</script>

<template>
  <header class="header">
    <div class="header__login">
      <User/>
    </div>
    <h1 class="header__title">Running Club</h1>
    <nav class="h-unstyled-list header__actions">
      <button class="button button--icon" data-modal-trigger="settings-modal">
        <img src="../../icons/settings.svg" alt="Settings" title="Settings" height="24" width="24" />
      </button>
    </nav>
  </header>
</template>
