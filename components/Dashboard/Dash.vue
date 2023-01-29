<template>
	<div>
		<div v-if="!allConferences">No Conferences for this user</div>
		<div v-else>
			<div v-for="conference in allConferences" :key="conference.id">
				<pre>{{ conference }}</pre>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { FullConference } from '../../types/index.d';

	const { $client } = useNuxtApp();
	const user = useSupabaseUser();
	let allConferences = $ref<FullConference[]>();

	onMounted(async () => {
		if (!user.value) {
			return;
		}
		allConferences = await $client.conference.getAllConferences.query({
			userId: user.value.id,
		});
	});
</script>
