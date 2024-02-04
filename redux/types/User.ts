export default interface User {
    id: string
    created_at: string
    updated_at: string
    sr_code: string
    first_name: string
    last_name: string
    gender: string
    email: string
    emergency_no: string[]
    medical_conditions: string[]
    province: string
    city: string
    barangay: string
    profile_photo: string
}