<script>
    export let header = "";
</script>

<div class="card mb-2">
    <div class="card-header">{header}</div>
    <div class="card-body">
        <slot></slot>
    </div>
</div>