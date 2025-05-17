function formatTimestamp(isoString) {
    const date = new Date(isoString);
    if (isNaN(date)) return 'Invalid date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}
