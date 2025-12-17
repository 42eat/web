<script setup lang="ts">
import { ref } from 'vue';
import FoyerLogoNeon from './assets/images/FoyerLogoNeon.vue';

const isActive = ref(true);

function randomTimedLoop() {
	isActive.value = !isActive.value;
	let delay;
	if (isActive.value) {
		delay = Math.pow(Math.floor(Math.random() * 40) + 10, 2);
	} else {
		delay = Math.pow(Math.floor(Math.random() * 20) + 10, 2);
	}
	setTimeout(randomTimedLoop, delay);
}

randomTimedLoop();

</script>

<template>
	<main>
		<div class="logo-wrapper">
			<FoyerLogoNeon class="foyer-main-logo" :class="{on: isActive}" />
		</div>
		<div class="title-wrapper">
			<h1>Web</h1>
			<h3>Coming Soon</h3>
		</div>
	</main>
</template>

<style scoped>
main {
	height: 100vh;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

.logo-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
}

.foyer-main-logo {
	width: 90%;
	height: 90%;
	stroke-linejoin: round;
	overflow: visible;
}

.foyer-main-logo path {
	transition: .1s;
}

.foyer-main-logo :deep(.neon) {
	stroke-width: 2px;
	stroke: rgba(var(--fill-main), .3);
	filter: drop-shadow(0 0 5px rgb(var(--fill-main)));
}

.foyer-main-logo :deep(.light) {
	stroke-width: 5px;
	stroke: rgba(var(--fill-main), .2);
}

.foyer-main-logo.on :deep(.neon) {
	stroke: rgba(var(--fill-main), .8);
	filter: drop-shadow(0 0 7px rgb(var(--fill-main)));
}

.foyer-main-logo.on :deep(.light) {
	stroke: rgba(var(--fill-main), .8);
	filter: drop-shadow(0 0 7px rgb(var(--fill-main)));
}

.title-wrapper {
	flex: 1;
	flex-shrink: 0;
	max-height: 20%;
}

.title-wrapper :is(h1, h3){
	text-align: center;
}

</style>
