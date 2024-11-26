function updateDropDownVisibility(id, visibility) {
    if (visibility) {
        document.getElementById(id)?.classList?.toggle('show');
    } else {
        document.getElementById(id)?.classList?.remove('show');
    }
}