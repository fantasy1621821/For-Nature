<template lang="pug">
  div
    .quill-editor(:content="descriptionData"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      v-quill:myQuillEditor="editorOption")
    div
</template>

<script>
    export default {
        name: "editor",
        props: {
            descriptionData: String
        },
        data() {
            return {
                content: ``,
                editorOption: {
                    // some quill options
                    modules: {
                        toolbar: [
                            [{'size': ['small', false, 'large', 'huge']}],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'align': []}],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['blockquote'],
                            ['clean']
                        ]
                    },
                    placeholder: '請輸入內容...',
                }
            }
        },
        mounted() {
        },
        methods: {
            onEditorBlur(editor) {
                // console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                // console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                // console.log('editor ready!', editor)
            },
            onEditorChange({editor, html, text}) {
                console.log('editor change!', editor, html, text)
                this.content = html
            }
        }
    }
</script>

<style scoped lang="sass">
</style>
