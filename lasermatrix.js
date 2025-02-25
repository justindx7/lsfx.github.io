class LaserGun {
    constructor(name, versionNum, updateDate, description, imageUrl, tech, parameters = []) {
        this.name = name;
        this.versionNum = versionNum;
        this.updateDate = updateDate;
        this.description = description;
        this.imageUrl = imageUrl;
        this.tech = tech;
        this.parameters = parameters;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'laser-gun';
        container.setAttribute('data-name', this.name);
        container.setAttribute('data-description', this.description);
        container.setAttribute('data-image', this.imageUrl);

        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = this.name;
        img.className = 'laser-gun-image';

        const title = document.createElement('h3');
        title.innerText = this.name;

        container.appendChild(img);
        container.appendChild(title);

        container.addEventListener('click', (event) => this.showDetails(event, container));

        return container;
    }

    showDetails(event, laserGunElement) {
        const galleryContainer = document.getElementById('gallery-container');
        const laserGuns = [...document.querySelectorAll('.laser-gun')];
        const existingDetails = document.querySelector('.details');

        if (existingDetails && existingDetails.dataset.name === this.name) {
            existingDetails.remove();
            return;
        }

        if (existingDetails) {
            existingDetails.remove();
        }

        const galleryWidth = galleryContainer.offsetWidth;
        const gunWidth = laserGuns[0].offsetWidth;
        const itemsPerRow = Math.floor(galleryWidth / gunWidth);
        const index = laserGuns.indexOf(laserGunElement);
        const lastIndexInRow = Math.min(laserGuns.length - 1, Math.ceil((index + 1) / itemsPerRow) * itemsPerRow - 1);

        const detailsElement = document.createElement('div');
        detailsElement.className = 'details';
        detailsElement.dataset.name = this.name;

        const parameterList = this.parameters.length > 0
            ? `<ul class="tech-parameters">${this.parameters.map(param => `<li>${param}</li>`).join('')}</ul>`
            : '';

        detailsElement.innerHTML = `
            <div class="details-title">
                <span class="details-laser-name">${this.name}</span>
                <small class="details-meta">v.${this.versionNum} • Updated: ${this.updateDate}</small>
            </div>
            <div class="details-separator">
                <div class="details-text">
                  <p class="details-description1">${this.description}</p>
                  <p class="details-description2">${this.tech}</p>
                  ${parameterList}
                </div>
                <div class="details-image-button">
                    <img src="${this.imageUrl}" alt="${this.name}" class="laser-gun-image" />
                    <button onclick="location.href='${this.name}.html'">Go</button>
                </div>
            </div>
        `;

        laserGuns[lastIndexInRow].insertAdjacentElement('afterend', detailsElement);
    }
}

// Create laser guns
const laserGuns = [
    new LaserGun('classic', "0.1.0", "10 - 12 - 2024", "Ol' Reliable. Your standard duty laser pistol. You could probably hold it in one hand.", 'assets/Classic.png', "A simple laser sound, inspired by the sounds of games you could find on the NES. You have control over the:", ["Speed", "Weight", "Colour"] ),
    new LaserGun('blaster', "0.1.2", "29 - 01 - 2025", "A more powerful shot. Excellent for high damage, or cooking a steak. It's your gun you decide.", 'assets/Blaster.png', "High-power laser with advanced modulations.", ["Build up Speed", "Tail Speed", "Weight", "Colour"]),
    new LaserGun('burst',"0.1.0" , "10 - 12 - 2024", "Designed specifically to turn your enemies into Swiss Cheese. RATATATA. Tell your team you need to reload.", 'assets/Burst.png', "Creates a series of consecutive shots in one go. Made with a single oscilator, combine it with compression for some heavy impact rounds. You can control the: ", ["Amount of rounds per burst", "Burst Fire Rate", "Weight", "Colour", "Variance"]),
    new LaserGun('arbiter', "0.1.0", "19 - 02 - 2025", "A little more technical, puts holes where you need them. Caution! May cause bleeding if used correctly.", 'assets/arbiter.png', "Similar to the Classic, but with added feedback combfiltering and comb filter movements. It adds some karplus strong-like tonality. With customizable: ", ["Speed", "Weight", "Movement Direciton", "Colour", "Scream"]),
];

// Append to gallery
const galleryContainer = document.getElementById('gallery-container');
laserGuns.forEach(laserGun => {
    galleryContainer.appendChild(laserGun.render());
});
