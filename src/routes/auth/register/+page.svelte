<script lang="ts">
	import type { ActionResult } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { applyAction, deserialize } from '$app/forms';
	import { goto } from '$app/navigation';

	let errors = $state({});
	let isLoading = $state(false);
	let showMessageApi = $state(false);
	let messageApiSuccess = $state('');
	let { data, form }: { data: PageData; form: ActionData } = $props();
	const handleSubmit = async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		event.preventDefault();
		isLoading = true;
        showMessageApi = false;
        messageApiSuccess = ""
        errors = {}
        const form = new FormData(event.currentTarget)
        const response = await fetch(event.currentTarget.action,{
            method: 'POST',
            body: form
        })
        const result: ActionResult = deserialize(await response.text())
        isLoading = false
        if(result.type == 'success'){
            messageApiSuccess = result.data!.message;
            setTimeout(() => {
                goto('/auth/login');
            }, 1500);
        }else if(result.type == 'failure'){
            showMessageApi = true;
            if('errors' in result.data!){
                errors = result.data!.errors;
            }
        }
        setTimeout(() => {
            messageApiSuccess = ""
            showMessageApi = false;
        }, 1500);
        applyAction(result)
	};
</script>

<div data-theme="dark" class="container-fluid flex h-screen">
	<div class="container-fluid mx-auto w-full rounded pt-4">
		<div class="container-fluid">
			<div class="flex flex-row justify-start px-5">
				<a href="/auth/login" class="btn btn-ghost"><i class="fas fa-fw fa-arrow-left"></i></a>
			</div>
			<p class="text-center text-xl font-bold">Registrasi</p>
			<p class="mt-2 text-center font-medium text-gray-500">
				Silahkan isi form dibawah untuk mulai menggunakan aplikasi
			</p>
			{#if messageApiSuccess.length > 0}
				<div class="mt-2 px-5">
					<div role="alert" class="alert alert-success">
						<i class="fas fa-fw fa-check"></i>
						<span>{messageApiSuccess}</span>
					</div>
				</div>
			{/if}
            {#if form != null && showMessageApi}
                <div class="mt-2 px-5">
                    <div role="alert" class="alert alert-error">
                        <i class="fas fa-fw fa-triangle-exclamation"></i>
                        <span>{form.message}</span>
                    </div>
                </div>
            {/if}
			<form method="POST" action="?/registrasi" class="p-5" onsubmit={handleSubmit}>
				<div class="mb-3">
					<label for="username" class="font-medium text-gray-400">Username</label>
					<input
						type="text"
						name="username"
						placeholder="Username"
						class={'mt-2 h-12 w-full rounded-xl border-0 bg-gray-100 p-4 placeholder:font-medium placeholder:opacity-75 ' +
							('username' in errors ? '!border border-red-500' : '')}
						id="username"
					/>
					{#if 'username' in errors}
						<span class="text-xs text-error">{errors['username']}</span>
					{/if}
				</div>
				<div class="mb-3">
					<label for="name" class="font-medium text-gray-400">Nama</label>
					<input
						type="text"
						name="name"
						placeholder="Nama"
						class={'mt-2 h-12 w-full rounded-xl border-0 bg-gray-100 p-4 placeholder:font-medium placeholder:opacity-75 ' +
							('name' in errors ? '!border border-red-500' : '')}
						id="name"
					/>
					{#if 'name' in errors}
						<span class="text-xs text-error">{errors['name']}</span>
					{/if}
				</div>
                <div class="mb-3">
					<label for="email" class="font-medium text-gray-400">Email</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						class={'mt-2 h-12 w-full rounded-xl border-0 bg-gray-100 p-4 placeholder:font-medium placeholder:opacity-75 ' +
							('email' in errors ? '!border border-red-500' : '')}
						id="email"
					/>
					{#if 'email' in errors}
						<span class="text-xs text-error">{errors['email']}</span>
					{/if}
				</div>
                <div class="mb-3">
					<label for="password" class="font-medium text-gray-400">Password</label>
					<input
						type="password"
						name="password"
						placeholder="Password"
						class={'mt-2 h-12 w-full rounded-xl border-0 bg-gray-100 p-4 placeholder:font-medium placeholder:opacity-75 ' +
							('password' in errors ? '!border border-red-500' : '')}
						id="password"
					/>
					{#if 'password' in errors}
						<span class="text-xs text-error">{errors['password']}</span>
					{/if}
				</div>
                <div class="mb-3">
					<label for="confirmation_password" class="font-medium text-gray-400">Konfirmasi Password</label>
					<input
						type="password"
						name="confirmation_password"
						placeholder="Konfirmasi Password"
						class={'mt-2 h-12 w-full rounded-xl border-0 bg-gray-100 p-4 placeholder:font-medium placeholder:opacity-75 ' +
							('confirmation_password' in errors ? '!border border-red-500' : '')}
						id="confirmation_password"
					/>
					{#if 'confirmation_password' in errors}
						<span class="text-xs text-error">{errors['confirmation_password']}</span>
					{/if}
				</div>
				<button
					type="submit"
					class="hover:bg-outline-blue-500 btn btn-md btn-block rounded-full bg-blue-500 text-white"
					disabled={isLoading}>{isLoading ? 'Register...' : 'Registrasi'}</button
				>
			</form>
		</div>
	</div>
</div>
