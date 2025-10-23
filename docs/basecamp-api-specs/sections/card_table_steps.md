Card table steps
================

Endpoints:

- [Get steps in a card](#get-steps-in-a-card)
- [Create a step](#create-a-step)
- [Update a step](#update-a-step)
- [Change step completion status](#change-step-completion-status)
- [Reposition a step](#reposition-a-step)

Get steps in a card
--------------------

Steps are returned unpaginated as part of the [Get a card][card] endpoint payload.

Create a step
-------------------------

* `POST /buckets/1/card_tables/cards/2/steps.json` creates a step within the card with ID `2` in the project with id `1`.

**Required parameters**: `title` of the step.

_Optional parameters_:

* `due_on` - due date (ISO 8601) of the step.
* `assignees` - a comma separated list of people ids that will be assigned to this step. Please see the [Get people][people] endpoints to retrieve them.

This endpoint will return `201 Created` with the current JSON representation of the step if the creation was a success. See the step property of the [Get a card][card] endpoint for more info on the payload.

###### Example JSON Request

``` json
{
  "title": "Inspiration",
  "due_on": "2021-01-01",
  "assignees": "30068628,270913789"
}
```

###### Copy as cURL

``` shell
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"title": "Inspiration", "due_on": "2021-01-01", "assignees": "30068628,270913789"}' \
  https://3.basecampapi.com/$ACCOUNT_ID/buckets/1/card_tables/cards/2/steps.json
```

Update a step
-----------------------

* `PUT /buckets/1/card_tables/steps/2.json` allows changing of the step with an ID of `2` in the project with ID `1`.

_Optional parameters_:

* `title` - of the card.
* `due_on` - due date (ISO 8601) of the step.
* `assignees` - a comma separated list of people ids that will be assigned to this step. Please see the [Get people][people] endpoints to retrieve them.

This endpoint will return `200 OK` with the current JSON representation of the step if the update was a success. See the step property of the [Get a card][card] endpoint for more info on the payload.

###### Example JSON Request

``` json
{
  "title": "Updated inspiration"
}
```

###### Copy as cURL

``` shell
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"title": "Updated inspiration"}' -X PUT \
  https://3.basecampapi.com/$ACCOUNT_ID/buckets/1/card_tables/steps/2.json
```

Change step completion status
-----------------------------

* `PUT /buckets/1/card_tables/steps/2/completions.json` will mark the step with an ID of `2` in the project with ID `1` as completed or uncompleted depending on the completion parameter.

**Required parameters**:

* `completion` – Set to "on" to mark the step as completed and to "off" to mark the step as uncompleted.

This endpoint will return `200 OK` with the current JSON representation of the step if the update was a success. See the step property of the [Get a card][card] endpoint for more info on the payload.

###### Example JSON Request

``` json
{
  "completion": "on"
}
```

###### Copy as cURL

``` shell
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"completion": "on"}' -X PUT \
  https://3.basecampapi.com/$ACCOUNT_ID/buckets/1/card_tables/steps/2/completions.json
```

Reposition a step
-----------------------------

* `POST /buckets/1/card_tables/cards/2/positions.json` allows changing the position of the step with an ID of `source_id` in the card with id `2`.

**Required parameters**:

* `source_id` – the step id. Step ids can be found via the [Get a card][card] endpoint.
* `position` – Zero indexed.

This endpoint will return `204 No Content` if successful.

###### Example JSON Request

``` json
{
  "source_id": 3,
  "position": 4
}
```

``` shell
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"source_id": 3, "position": 4}' -X POST \
  https://3.basecampapi.com/$ACCOUNT_ID/buckets/1/card_tables/cards/2/positions.json
```

[card]: https://github.com/basecamp/bc3-api/blob/master/sections/card_table_cards.md#get-a-card
[people]: https://github.com/basecamp/bc3-api/blob/master/sections/people.md#get-all-people
