<script>
	import { Link } from "svelte-navigator";
	export let to = "";
	export let icon = "";
	export let title = "";

    let isActive;

	function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
		isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;
	}
</script>

<Link {to} {getProps}>
    <span class="nav-link {isActive ? "active" : ""} link-dark">
        <i class="fa-solid {icon}"></i>
        {title}
    </span>
</Link>