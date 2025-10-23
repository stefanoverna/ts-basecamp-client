Rich text
=========

Many resources, including messages, documents, and comments, represent their content as rich text in HTML. Rich text content may contain lists, block quotes, simple formatting, and inline attachments such as mentions, images, and files.


Working with rich text HTML
---------------------------

If your application reads Basecamp rich text content, it must be able to process HTML. Use a web view component to render rich text content unmodified. Or, if your application needs a plain-text representation of rich text content, first decode any HTML entities, then replace `<br>` tags with line breaks, and finally strip the remaining HTML tags.

Similarly, if your application writes rich text content, it must be able to generate well-formed HTML. At a minimum, this means properly encoding HTML entities and replacing line breaks with `<br>` tags.

Applications that modify existing rich text content should take special care not to discard any formatting or attachments during processing. Consider using a full HTML parser to manipulate rich text content. Libraries such as [Nokogiri](http://www.nokogiri.org) (Ruby) and [Cheerio](https://github.com/cheeriojs/cheerio) (Node.js) are good fits for this scenario.


Allowed HTML tags
-----------------

You may use the following standard HTML tags in rich text content: `div`, `h1`, `br`, `strong`, `em`, `strike`, `a` (with an `href` attribute), `pre`, `ol`, `ul`, `li`, and `blockquote`. Any other tags will be removed automatically.

The special `<bc-attachment>` tag allows you to insert an inline attachment. Each `<bc-attachment>` has an `sgid` attribute which points to the `attachable_sgid` attribute of an attachable Basecamp resource. Your application will receive a rendered representation of the attachable resource inside the `<bc-attachment>` tag in API responses.


Inserting a mention
-------------------

Mentions in rich text content are attachments that reference a [Person](people.md) on the current [Project](projects.md). When you submit rich text content with mentions, Basecamp delivers a special notification to each mentioned person.

Create a mention in Basecamp's rich text editor by typing "@" and selecting a person from the drop-down list. Create mentions with the API by inserting a `<bc-attachment>` tag with an `sgid` attribute pointing to the person's `attachable_sgid`.

For example, to mention this person:

```json
  {
    "id": 1007299208,
    "name": "Victor Cooper",
    "attachable_sgid": "BAh7CEkiCG..."
  }
```

Submit this rich text content:

```html
  <bc-attachment sgid="BAh7CEkiCG..."></bc-attachment>
```

The Basecamp API will return an expanded representation similar to the following:

```html
  <bc-attachment sgid="BAh7CEkiCG..." content-type="application/vnd.basecamp.mention">
    <figure>
      <img srcset="..." src="..." class="avatar" ...>
      <figcaption>Victor</figcaption>
    </figure>
  </bc-attachment>
```


Inserting an image or file attachment
-------------------------------------

To insert an image or file attachment in rich text content, first [create an Attachment](attachments.md#create-an-attachment). You will receive an `attachable_sgid` in response:

```json
  {
    "attachable_sgid": "BAh7CEkiCG..."
  }
````

Take this `attachable_sgid` and use it to submit rich text content with a `<bc-attachment>` tag:

```html
  <bc-attachment sgid="BAh7CEkiCG..."></bc-attachment>
```

If the attachment is an image, you may optionally include a `caption` attribute, which will appear below the attachment in rendered rich text content:

```html
  <bc-attachment sgid="BAh7CEkiCG..." caption="My photo"></bc-attachment>
```

The Basecamp API will return an expanded representation similar to the following:

```html
  <bc-attachment sgid="BAh7CEkiCG..." content-type="image/jpeg" width="2560" height="1536" url="..." href="..." filename="my-photo.jpg" caption="My photo">
    <figure>
      <img srcset="..." src="...">
      <figcaption>My photo</figcaption>
    </figure>
  </bc-attachment>
```

Be sure to provide an appropriate `Content-Type` header when creating image attachments. If the attachment's content type does not start with `image/`, it will be presented as a file instead of an image with a preview.

Also, notice that you must create new attachments for rich text contents, you can't reuse them from other elements (e.g: uploads).

### Image galleries
You can also present image attachments grouped in a _gallery_. For this, you need to include the `presentation="gallery"` attribute to the `bc-attachment` element and they need to be inside their own container element, typically a `<div>`. That is:
```
<div>
  <bc-attachment presentation="gallery" sgid="BAh7CEki..."></bc-attachment>
  <bc-attachment presentation="gallery" sgid="BAh7CEki..."></bc-attachment>
</div>
```

Appendix
--------

### Rich text content attributes

The following attributes contain rich text content in HTML format:

- [Comment `content`](comments.md#get-a-comment)
- [Client approval `content`](client_approvals.md#get-a-client-approval)
- [Client correspondence `content`](client_correspondences.md#get-a-client-correspondence)
- [Client reply `content`](client_replies.md#get-a-client-reply)
- [Document `content`](documents.md#get-a-document)
- [Message `content`](messages.md#get-a-message)
- [Question answer `content`](question_answers.md#get-a-question-answer)
- [Schedule entry `description`](schedule_entries.md#get-a-schedule-entry)
- [To-do list `description`](todolists.md#get-a-to-do-list)
- [To-do `description`](todos.md#get-a-to-do)
- [Upload `description`](uploads.md#get-an-upload)


### Attachable resources

The following resources contain an `attachable_sgid` attribute which can be used to create a `<bc-attachment>` tag in rich text content:

- [Attachment](attachments.md)
- [Person](people.md)
