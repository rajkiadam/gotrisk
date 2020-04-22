/**
 * Representing an <area> html tag with extended attributes
 */
export class Area {
    target: string
    alt: string
    title: string
    href: string
    coords: string
    shape: string
    // code name of the territory
    codeName: string

    constructor(codeName: string, target: string, alt: string, title: string, href: string, coords: string, shape: string){
        this.codeName = codeName
        this.target=target
        this.alt = alt
        this.title = title
        this.href = href
        this.coords = coords
        this.shape = shape
    }

    onClick() {
        window.alert('This is the '+this.title+ ' territory.')
    }
}