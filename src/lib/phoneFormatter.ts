


const phoneFormatter = (phone: string) => {
    if (phone.startsWith('+62')) return phone
    if (!phone.startsWith('0')) return false
    return phone.replace(/^0/, '+62')
}

export default phoneFormatter