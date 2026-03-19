import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

const supabaseUrl = 'https://oemvnqqutnjcjdniikav.supabase.co';
const supabaseKey = 'sb_publishable_EXlYEOQCtIayaRgM8do3Bg_tVLyYTux';

export const supabase = createClient(supabaseUrl, supabaseKey);

// FETCH PROJECTS
export async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) console.error('Fetch error:', error);
    return data || [];
}

// UPLOAD IMAGE (YOUR BUCKET)
export async function uploadImage(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error } = await supabase.storage
            .from('madevelopers')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        const { data } = supabase.storage
            .from('madevelopers')
            .getPublicUrl(filePath);

        return { success: true, url: data.publicUrl };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ADD PROJECT
export async function addProject(projectData) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([projectData]);

        if (error) throw error;

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// LOGIN
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

// GET SESSION
export async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}

// LOGOUT
export async function logout() {
    await supabase.auth.signOut();
}
