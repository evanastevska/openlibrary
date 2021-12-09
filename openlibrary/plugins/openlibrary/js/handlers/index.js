import { FadingToast } from '../Toast.js';

export function initRatingHandlers(ratingForms) {
    for (const form of ratingForms) {
        form.addEventListener('submit', function(e) {
            handleRatingSubmission(e, form);
        })
    }
}

function handleRatingSubmission(event, form) {
    event.preventDefault();
    // Continue only if selected star is different from previous rating
    if (!event.submitter.classList.contains('star-selected')) {

        // Construct form data object:
        const formData = new FormData(form);
        let rating;
        if (event.submitter.value) {
            rating = Number(event.submitter.value)
            formData.append('rating', event.submitter.value)
        }
        formData.append('ajax', true);

        // Make AJAX call
        fetch(form.action, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ratings update failed')
                }
                // Repaint stars
                form.querySelectorAll('.star-selected').forEach((elem) => {
                    elem.classList.remove('star-selected');
                    if (elem.hasAttribute('property')) {
                        elem.removeAttribute('property');
                    }
                })

                const clearButton = form.querySelector('.star-messaging');
                if (rating) {
                    clearButton.classList.remove('hidden');
                    form.querySelectorAll(`.star-${rating}`).forEach((elem) => {
                        elem.classList.add('star-selected');
                        if (elem.tagName === 'LABEL') {
                            elem.setAttribute('property', 'ratingValue')
                        }
                    })
                } else {
                    clearButton.classList.add('hidden');
                }
            })
            .catch((error) => {
                new FadingToast(error.message).show();
            })
    }
}
