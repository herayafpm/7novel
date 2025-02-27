import { db } from '$lib/server/db/index.js'
import * as table from '$lib/server/db/schemes';
import { fail, type Actions } from '@sveltejs/kit'
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'

export async function load(event) {
    return {}
}

export const actions: Actions = {
    registrasi: async (event) => {
        const formData = await event.request.formData()
        const username = formData.get('username')?.toString() ?? ''
        const name = formData.get('name')?.toString() ?? ''
        const email = formData.get('email')?.toString() ?? ''
        const password = formData.get('password')?.toString() ?? ''
        const confirmation_password = formData.get('confirmation_password')?.toString() ?? ''
        const errors: {[key:string]:any} = {}
        if(username!.length == 0){
            errors['username'] = 'Username tidak boleh Kosong';
        }else{
            const [checkUsername] = await db.select().from(table.user).where(eq(table.user.username,username!))
            if(checkUsername){
                errors['username'] = 'Username sudah ada, gunakan yang lain';
            }
        }
        if(name!.length == 0){
            errors['name'] = 'Nama tidak boleh Kosong';
        }
        if(email!.length == 0){
            errors['email'] = 'Email tidak boleh Kosong';
        }else{
            const [checkEmail] = await db.select().from(table.user).where(eq(table.user.email,email!))
            if(checkEmail){
                errors['email'] = 'Email sudah ada, gunakan yang lain';
            }
        }
        if(password!.length == 0){
            errors['password'] = 'Password tidak boleh Kosong';
        }
        if(confirmation_password!.length == 0){
            errors['confirmation_password'] = 'Konfirmasi Password tidak boleh Kosong';
        }else{
            if(confirmation_password != password){
                errors['confirmation_password'] = 'Konfirmasi Password Harus Sama Dengan Password';
            }
        }
        if(Object.keys(errors).length > 0){
            return fail(400,{message:"Validasi Gagal",errors})
        }
        const [user] = await db.insert(table.user).values({
            username,
            name,
            email,
            password: await bcrypt.hash(password!,10),
        }).returning({id: table.user.id})
        if(user){
            return {message: 'Berhasil Registrasi'}
        }else{
            return fail(400,{message:"Gagal Registrasi"})
        }
    }
}