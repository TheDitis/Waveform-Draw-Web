<script lang="ts">
    // import example1 from '../../../assets/PhonePhoto5.jpeg'
    import { ImageIcon } from "svelte-feather-icons";
    import IconButton from "../../General/IconButton.svelte";

    let fileInput: HTMLInputElement;
    let error: null | string;

    const onUpload = () => {
        if (fileInput.files) {
            console.log(fileInput.files[0]);
            const file = fileInput.files[0];
            if (!file.name.includes('image')) {
                error = 'file type must be an image';
                console.error(error)
                fileInput.files = null;
            }
        }
    }
</script>

<div class="ImageUploadModal">
    <h2>From Image</h2>
    <h3 style="color: red;">Coming soon...</h3>
    <p>
        Make a drawing of a waveform (should be like a function, with only 1 y value per x value, unless you want to have jumps in the waveform). Take a picture of that waveform in decent light and focus, and with as little background or competing curvature as possible. Here's an example:
    </p>
    <img src="assets/PhonePhoto5.jpeg" width="400px" alt="example drawing"/>

    <IconButton on:click={() => {fileInput.click()}} icon={ImageIcon} style="margin-top: 20px">CHOOSE IMAGE</IconButton>

    <input bind:this={fileInput} type="file" on:change={onUpload} accept="image/png, image/jpeg">
</div>

<style>
    .ImageUploadModal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 800px;
    }

</style>