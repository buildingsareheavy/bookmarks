export { Bookmark }

class Bookmark {
    constructor(title, url) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.url = url;
        this.tags = [];
        this.createdAt = new Date().toISOString();
    }
}
