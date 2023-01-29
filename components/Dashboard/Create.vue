<template>
	<div>
		<div class="grid w-screen place-items-center">
			<div class="mt-10 mb-20 md:w-[672px] w-full px-8 self-center">
				<FormKit
					type="form"
					submit-label="Submit"
					:actions="false"
					@submit="submitConference"
					:classes="{
						messages: classes.messages,
						message: classes.message,
					}">
					<FormKit type="group" v-model="conferenceFormData">
						<FormKit
							type="text"
							validation="required"
							name="title"
							label="Title"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="Location"
							name="location"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="Description"
							name="description_full"
							:classes="classes" />
						<FormKit
							type="number"
							label="Seats"
							validation="required"
							name="seats"
							step="1"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							name="objective1"
							label="Objectives"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							name="objective2"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							name="objective3"
							:classes="classes" />
						<FormKit
							type="datetime-local"
							label="Date and Time"
							name="date"
							:classes="classes"
							validation="required|date_after" />
					</FormKit>
					<FormKit
						type="submit"
						label="Add Conference"
						:disabled="disableConference"
						:classes="{
							outer: 'mb-2 mt-10',
							input: `${
								isLoading ? 'cursor-wait' : 'cursor-pointer'
							} bg-transparent font-bold text-white font-inter px-8 py-2 border border-white transition-all text-xs rounded-full hover:border-2 disabled:cursor-not-allowed`,
						}" />
				</FormKit>

				<div class="my-10 curs text-center">
					<h3 class="text-2xl font-bold">Organizers</h3>
				</div>

				<FormKit
					type="form"
					submit-label="Add Organizer"
					:actions="false"
					@submit="addOrganizer"
					:classes="{
						messages: classes.messages,
						message: classes.message,
					}">
					<FormKit type="group" v-model="organizerFormData">
						<FormKit
							type="text"
							validation="required"
							label="Name"
							name="name"
							:classes="classes" />
						<FormKit
							type="url"
							validation="required|url"
							label="Website"
							placeholder="https://www.example.com"
							name="website"
							:classes="classes" />
						<FormKit
							type="file"
							label="Icon"
							name="logo"
							:classes="{
								...classes,
								input:
									'w-full h-11 px-3 pt-2 rounded-lg border-none bg-white/70 font-inter text-base text-black placeholder-black focus:bg-white',
							}"
							accept=".jpg,.png,.svg,.ico"
							validation="required" />
						<div class="flex flex-wrap mb-10">
							<span
								class="m-1"
								v-for="organizer in organizersList"
								:key="organizer.id"
								><span
									class="px-6 py-2 text-xs font-bold rounded-full bg-appRed hover:bg-appRed/70 hover:cursor-pointer"
									@click="removeOrganizer(organizer.id, organizer.logo)"
									>{{ organizer.name }}</span
								></span
							>
						</div>
						<FormKit
							type="submit"
							class="mt-5"
							label="Add Organizer"
							:classes="{
								outer: 'mb-5',
								input: `${
									isLoading ? 'cursor-wait' : 'cursor-pointer'
								} bg-transparent font-bold text-white font-inter px-8 py-2 border border-white transition-all text-xs rounded-full hover:border-2`,
							}" />
					</FormKit>
				</FormKit>

				<div class="my-10 text-center">
					<h3 class="text-2xl font-bold">Speakers</h3>
				</div>

				<FormKit
					type="form"
					submit-label="Add Speaker"
					:actions="false"
					@submit="addSpeaker"
					:classes="{
						messages: classes.messages,
						message: classes.message,
					}">
					<FormKit type="group" v-model="speakerFormData">
						<FormKit
							type="text"
							validation="required"
							label="Name"
							name="name"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="Position"
							name="position"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="Company"
							name="company"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="About"
							name="about"
							:classes="classes" />
						<FormKit
							type="text"
							validation="required"
							label="Topic"
							name="topic"
							:classes="classes" />
						<FormKit
							type="datetime-local"
							label="Date and Time"
							name="time"
							:classes="classes"
							validation="required|date_after" />
						<FormKit
							type="file"
							label="Image"
							name="image"
							:classes="{
								...classes,
								input:
									'w-full h-11 px-3 pt-2 rounded-lg border-none bg-white/70 font-inter text-base text-black placeholder-black focus:bg-white',
							}"
							accept=".jpg,.png,.svg,.ico"
							validation="required" />
						<div class="flex flex-wrap mb-10">
							<span
								class="m-1"
								v-for="speaker in speakersList"
								:key="speaker.id"
								><span
									class="px-6 py-2 text-xs font-bold rounded-full bg-appRed hover:bg-appRed/70 hover:cursor-pointer"
									@click="removeSpeaker(speaker.id, speaker.image)"
									>{{ speaker.name }}</span
								></span
							>
						</div>
						<FormKit
							type="submit"
							class="mt-5"
							label="Add Speaker"
							:classes="{
								outer: 'mb-5',
								input: `${
									isLoading ? 'cursor-wait' : 'cursor-pointer'
								} bg-transparent font-bold text-white font-inter px-8 py-2 border border-white transition-all text-xs rounded-full hover:border-2`,
							}" />
					</FormKit>
				</FormKit>
				<FormKit
					type="button"
					class="mt-5"
					label="Done"
					@click="cancelConference"
					:classes="{
						outer: 'mb-5 mt-20',
						input: `${
							isLoading ? 'cursor-wait' : 'cursor-pointer'
						} bg-appRed hover:bg-appRed/70 font-bold text-white font-inter w-full rounded-lg h-10`,
					}" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { FormKit } from '@formkit/vue';
	import { useDashComponentStore } from '~~/stores/useDashComponentStore';
	import { Organizer, Speaker } from '@prisma/client';

	const { setDashComponentValue } = useDashComponentStore();
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const { $client } = useNuxtApp();

	let isLoading = $ref(false);
	let conferenceFormData = $ref<any>({});
	let organizerFormData = $ref<any>({});
	let organizersList = $ref<Organizer[]>([]);
	let speakerFormData = $ref<any>({});
	let speakersList = $ref<Speaker[]>([]);
	let disableConference = $ref<boolean>(false);
	let conferId = $ref<string>();

	const addOrganizer = async () => {
		if (!user.value || disableConference === false || !conferId) {
			return;
		}
		const { data } = await client.storage
			.from('conference')
			.upload(
				`/organizer/${organizerFormData.logo[0].name}`,
				organizerFormData.logo[0].file,
			);
		if (!data) {
			return;
		}
		const newOrganizerData = {
			conferenceId: conferId,
			logo: data.path,
			name: organizerFormData.name,
			website: organizerFormData.website,
		};
		isLoading = true;
		const organizer = await $client.organizer.postOrganizer.mutate(
			newOrganizerData,
		);
		isLoading = false;
		organizersList.push(organizer);
	};

	const removeOrganizer = async (id: string, logo: string) => {
		const removedOrganizer = await $client.organizer.deleteOrganizer.mutate({
			id,
		});
		if (removedOrganizer) {
			const { data } = await client.storage.from('conference').remove([logo]);
			const newList = organizersList.filter(org => {
				return org.id !== id;
			});
			organizersList = newList;
		}
	};

	const addSpeaker = async () => {
		if (!user.value || disableConference === false || !conferId) {
			return;
		}
		const { data } = await client.storage
			.from('conference')
			.upload(
				`/speaker/${speakerFormData.image[0].name}`,
				speakerFormData.image[0].file,
			);
		if (!data) {
			return;
		}
		const newSpeakerData = {
			conferenceId: conferId,
			name: speakerFormData.name,
			image: data.path,
			position: speakerFormData.position,
			company: speakerFormData.company,
			about: speakerFormData.about,
			time: new Date(speakerFormData.time).toISOString(),
			topic: speakerFormData.topic,
		};
		isLoading = true;
		const speaker = await $client.speaker.postSpeaker.mutate(newSpeakerData);
		isLoading = false;
		speakersList.push(speaker);
	};

	const removeSpeaker = async (id: string, image: string) => {
		const removedSpeaker = await $client.speaker.deleteSpeaker.mutate({
			id,
		});
		if (removedSpeaker) {
			const { data } = await client.storage.from('conference').remove([image]);
			const newList = speakersList.filter(speaker => {
				return speaker.id !== id;
			});
			speakersList = newList;
		}
	};

	const submitConference = async () => {
		if (!user.value || disableConference) {
			return;
		}
		const newConferenceData = {
			userId: user.value.id,
			title: conferenceFormData.title,
			date: new Date(conferenceFormData.date).toISOString(),
			location: conferenceFormData.location,
			description_points: [
				conferenceFormData.objective1,
				conferenceFormData.objective2,
				conferenceFormData.objective3,
			],
			description_full: conferenceFormData.description_full,
			seats: parseInt(conferenceFormData.seats),
		};
		isLoading = true;
		const conference = await $client.conference.postConference.mutate(
			newConferenceData,
		);
		isLoading = false;
		conferId = conference.id;
		disableConference = true;
	};

	const cancelConference = () => {
		conferenceFormData = {};
		organizerFormData = {};
		speakerFormData = {};
		disableConference = false;
		setDashComponentValue('dash');
	};

	const classes = {
		outer: 'mb-5',
		label: 'block mb-1 font-bold text-sm font-inter',
		inner: 'max-w-2xl rounded-lg mb-1 overflow-hidden font-inter text-black ',
		input:
			'w-full h-11 px-3 rounded-lg border-none bg-white/70 font-inter text-base text-black placeholder-black focus:bg-white',
		help: 'text-xs text-white font-inter',
		messages: 'list-none p-0 mt-1 mb-0 font-inter',
		message: 'text-appRed mb-1 text-xs font-inter',
	};
</script>
