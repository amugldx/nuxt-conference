<template>
	<div>
		<div> Dashboard </div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: 'no-user-auth',
	});
</script>
