const characters = {}
const locations = {}

class Player {
    constructor(name, description, location, items) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.icon = 'player/player.jpg'
        this.items = items || [];
        this.health = 100;
    }
}

class Character {
    constructor(name, description, location, icon, items) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.icon = icon || 'media/icons/person.svg';
        this.items = items || [];
        this.health = 100;

        if (location) {
            locations[this.location].characters.push(this.name);
        }

        characters[this.name] = this;
    }

    rename(newName) {
        if (characters.hasOwnProperty(this.name)) {
            delete characters[this.name];
            this.name = newName;
            characters[newName] = this;
        }
    }

    move(newLocation) {
        const oldLocation = this.location;
        
        locations[oldLocation].characters = locations[oldLocation].characters.filter(
            (characterName) => characterName !== this.name
        );
    
        this.location = newLocation;
        locations[newLocation].characters.push(this.name);
    }
    
    
}


class Location {
    constructor(name, description, neighbors, characters, items) {
        this.name = name;
        this.description = description;
        this.neighbors = neighbors || [];
        this.characters = characters || [];
        this.items = items || [];

        locations[this.name] = this;
    }

}

class Item {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

const player = new Player("Mysterious Traveler", "A mysterious traveler new to Occidaria. Upon arriving in Occidarian Capital City was thrown in jail on suspicion of smuggling.", null)

new Location("Occidarian Capital City Bound Ship", "A ship bound to Occidarian Capital City.", ["Occidarian Capital City Western Port"]);
new Location("Occidarian Capital City Western Port", "Western Port, Occidaria's thriving epicenter, is a vibrant blend of trade, commerce, and innovative engineering, boasting docks, market stalls, and windmills amidst vigilant city watchmen and an awe-inspiring capital cityscape.", ["Western Port Markets", "Western Port Warehouses"]);
new Location("Western Port Markets", "Western Port Markets is a lively, sprawling bazaar where merchants and artisans showcase a diverse array of goods, their stalls energized by the hum of windmills and the chatter of eager patrons.", ["Occidarian Capital City Western Port", "Markets Alley Way", "Western Port Warehouses"]);
new Location("Western Port Warehouses", "Western Port Warehouses form an expansive and orderly district, housing vast stores of goods in towering structures, all maintained by ingenious crane systems and the diligent labor of workers.", ["Occidarian Capital City Western Port", "Warehouses Alley Way", "Western Port Markets"]);
new Location("Markets Alley Way", "Markets Alley Way is a narrow, bustling passageway that links the vibrant Western Port Markets to the Markets Trash Dump, allowing for efficient waste management and a cleaner marketplace experience.", ["Western Port Markets", "Markets Trash Dump", "Warehouses Alley Way"]);
new Location("Warehouses Alley Way", "Warehouses Alley Way is a well-trodden path that seamlessly connects Western Port Warehouses to Markets Alley Way and the Occidarian Capital City Guards Quarters, ensuring security and efficient flow of goods and people.", ["Western Port Warehouses", "Markets Alley Way", "Occidarian Capital City Guards Quarters", "Occidarian Capital City Jail"]);
new Location("Markets Trash Dump", "Markets Trash Dump serves as a crucial waste disposal site, connecting the Occidarian Capital City Sewers to Markets Alley Way, effectively managing refuse and maintaining cleanliness in the bustling marketplace.", ["Markets Alley Way", "Occidarian Capital City Sewers"]);
new Location("Occidarian Capital City Sewers", "The Occidarian Capital City Sewers form an intricate network of underground tunnels, efficiently channeling wastewater away from the bustling city above and safeguarding public health.", ["Markets Trash Dump", "Occidarian Capital City Jail Storages", "Occidarian Capital City Jail"]);
new Location("Occidarian Capital City Jail", "Occidarian Capital City Jail is a formidable, heavily fortified structure that houses wrongdoers and criminals, ensuring order and safety within the capital city.", ["Occidarian Capital City Guards Quarters", "Occidarian Capital City Jail Court Yard", "Occidarian Capital City Jail Storages", "Occidarian Capital City Sewers", "Markets Alley Way"]);
new Location("Occidarian Capital City Guards Quarters", "Occidarian Capital City Guards Quarters serve as the home and operational base for the city's watchmen, offering living quarters, training facilities, and strategic planning rooms in a well-organized compound.", ["Warehouses Alley Way", "Occidarian Capital City Jail", "Occidarian Capital City Guard Tower"]);
new Location("Occidarian Capital City Jail Storages", "Occidarian Capital City Jail Storages is a series of secure, well-organized rooms housing prisoners' belongings, confiscated contraband, and essential supplies for the operation and maintenance of the jail.", ["Occidarian Capital City Jail", "Occidarian Capital City Sewers","Occidarian Capital City Jail Court Yard"]);
new Location("Occidarian Capital City Jail Court Yard", "Occidarian Capital City Jail Court Yard is a monitored, enclosed space where inmates are permitted to gather for fresh air, exercise, and occasional social interactions under the watchful eyes of the guards.", ["Occidarian Capital City Jail", "Occidarian Capital City Jail Storages", "Occidarian Capital City Guard Tower"]);
new Location("Occidarian Capital City Guard Tower", "Occidarian Capital City Guard Tower stands tall as a sentinel above the capital.", ["Occidarian Capital City Guards Quarters", "Occidarian Capital City Jail Court Yard"]);
  
new Character("Sailor", "A sailor.", "Occidarian Capital City Bound Ship", getIconById(296));
new Character("Bard", "A master of numerous instruments, Eldric is best known for enchanting audiences with his intricate tales and clever limericks. His vast repertoire, spanning from legendary heroes to biting political satire, garners him a mix of admiration and disdain. Upon arriving in Occidarian Capital City was thrown in jail on suspicion of smuggling.", "Occidarian Capital City Bound Ship", getIconById(47));
new Character("Occidarian Guard", "A Occidarian guard.", "Occidarian Capital City Western Port", getIconById(222));

new Character("Warden Aldous", "The stern and unyielding warden of Occidarian Capital City Jail, Aldous is responsible for maintaining order and overseeing the prisoners. He is a tall, muscular man with graying hair and a stern expression, commanding respect from his subordinates.", "Occidarian Capital City Jail");
new Character("Jailer Gruff", "A grizzled veteran of the Occidarian Capital City Guard, Jailer Gruff is responsible for managing the day-to-day operations within the jail. He's known for his no-nonsense attitude and is rarely seen without his heavy iron keyring dangling from his belt.", "Occidarian Capital City Jail");
new Character("Inmate Roderick", "A charming rogue who's always planning his next escape, Roderick is well-known among the inmates for his cunning and resourcefulness. Despite his frequent attempts to escape, he holds a begrudging respect for the jail's security measures and staff.", "Occidarian Capital City Jail");
new Character("Inmate Giselle", "A skilled thief with a sharp wit, Giselle was caught during a daring heist and now bides her time in the jail. She's become an unofficial leader among the inmates, using her charisma and intelligence to keep tensions low and morale high.", "Occidarian Capital City Jail");
new Character("Inmate Brother Osmund", "A former monk, Brother Osmund has been imprisoned for preaching dissent against the ruling powers. Soft-spoken and wise, he has become a source of spiritual guidance and solace for many of the inmates, offering words of wisdom and hope.", "Occidarian Capital City Jail");
new Character("Inmate Agnes", "Imprisoned for her uncanny ability to predict the future, Agnes has attracted both fear and curiosity from her fellow inmates. Quiet and introverted, she tends to keep to herself, only sharing her foresight with a select few who have earned her trust.", "Occidarian Capital City Jail");
new Character("Guard Captain Eamon", "A loyal officer of the Occidarian Capital City Guard, Captain Eamon is responsible for maintaining security within the jail. He is an honorable man, committed to his duty and focused on the safety of the city and its citizens.", "Occidarian Capital City Jail");
new Character("Apprentice Tinkerer Mira", "A young apprentice to one of the tinkerer groups studying the mystical arts, Mira has been sent to the jail to study its ancient enchantments. She is bright-eyed and eager, her passion for magic and knowledge shining through her work.", "Occidarian Capital City Jail");
