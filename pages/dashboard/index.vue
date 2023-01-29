<template>
	<div>
		<div>
			<DashboardNav />
			<h1 class="mt-10 text-2xl font-bold text-center">{{ title }}</h1>
			<div v-if="getDashComponentValue === 'create'">
				<DashboardCreate />
			</div>
			<div v-else-if="getDashComponentValue === 'edit'"><DashboardEdit /></div>
			<div v-else>
				<DashboardDash />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useDashComponentStore } from '~~/stores/useDashComponentStore';
	const user = useSupabaseUser();
	const { getDashComponentValue } = $(useDashComponentStore());

	const title = $computed(() => {
		if (getDashComponentValue === 'create') {
			return 'Create Conference';
		} else if (getDashComponentValue === 'edit') {
			return 'Edit Conference';
		} else {
			return 'All Conferences';
		}
	});

	const allConferences = async () => {
		const { data } = useFetch('/api/conference', {
			method: 'GET',
		});
		console.log(data.value);
		console.log(user.value?.id);
	};
	allConferences();
	definePageMeta({
		middleware: 'user-auth',
	});
</script>
