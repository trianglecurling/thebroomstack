# Thoughts on Event Registration

In this document I will describe my thoughts on event registration and map them to technical considerations and design.

## Scarcity

Most events have a capacity limit. For example, a bonspiel may be limited to 32 teams, or a learn-to-curl to 32 participants. With a limit on capacity, it is important to think carefully about how to admit registrants.

## Methodologies

Here are several ways to handle registration for events with limited capacity.

### Random draw

1. Open registration for a defined time period.
2. Once the registration time period has ended, produce a random ordering of the list of valid registrations.
3. The first `n` registrants are admitted, where `n` is the capacity limit of the event.
4. The remaining registrants are placed into a waiting list in the same order.
5. Payment is collected for admitted registrants. The window of time to accept payment should be enforced so that non-paying registrants can be swiftly removed and replaced by someone on the waiting list.

Pros:

* Completely fair: each registrant has the same chance of being admitted.
* Automatically generates a waiting list

Cons:

* Each registrant must wait until the end of the registration time period to find out if they were admitted.
* There is nothing a registrant can do to improve their own chances of admission.
* Luck is a factor.
* Payment can't be collected at registration time. This may lead to more cancelled registrations, and it adds an additional payment collection step.

Modifications:

* Adjust the random ordering process. For example, a registrant who was not admitted to a previous event might be given better odds. The event organizer may want to introduce additional factors at their discretion.
* Non-paying registrants can be moved to the front of the waiting list.

How to get it right:

* Transparency is important for the random ordering process. For 99% of cases, a computerized random draw is probably sufficient. For an extremely contentious event, it may be better to physically draw names, preferably in person in front of all stakeholders, or in real time with a scheduled live stream.

### First come, first serve

1. Open registration at a defined date and time.
2. Admit the first `n` registrants, where `n` is the capacity limit of the event.
3. Any registrants after `n` are placed into a waiting list in the same order they registered.

Pros:

* Individuals can improve their own chances by ensuring they are available when registration opens.
* Payment can be collected at registration time.

Cons:

* It may be impossible to open registration at a time that is convenient for all potential registrants. This is especially true if registration is expected from multiple time zones.
* Those with faster internet connections or typing skills may have an advantage.
* In my experience, registrants are more hesitant to join a waiting list, so this process may result in a smaller waiting list.

Modifications:

* Split the registration into multiple openings, each adding additional capacity. This can alleviate the unfairness of having a single registration opening time. However, it complicates the waiting list as the waiting list can't be opened until after the last opening.

How to get it right:

* Inform potential registrants of the exact registration opening time (don't forget to include time zone information).
* Open registration at the exact time you have communicated (no earlier than, and no more than 30 seconds after).
* Make sure your registration software and the web services that run it are performant enough to handle a large traffic spike.
* Take measures to ensure that registrants with more data to enter are not penalized by the time required to enter that data (more details below).

Technical details:

* Show a live-updating countdown timer on the registration page that is synchronized with the server time.
* Allow registrants to pre-fill the form with all their information before registration opens, with a submit button becoming available as soon as the registration time comes up.

### Vickrey auction

1. Open registration for a defined time period with each registrant supplying a "bid" for the registration fee (optionally with a minimum bid amount).
2. When the registration time period has ended, order all registrants in descending order of their bid.
3. From that ordered list, admit the first `n` registrants, where `n` is the capacity limit of the event.
4. Each admitted registrant pays the registration fee that was bid by the `n`th registrant in the ordered list.
5. Cancellations *must* carry some penalty, for example a non-refundable portion of the registration fee.

Pros:

* May produce additional revenue.
* All registrants pay the same amount, which is equal to or less than the amount they are willing to pay.
* Individual registrants have the most control over their own admission.

Cons:

* Payment cannot be collected at registration time.
* Each registrant must wait until the end of the registration time period to find out if they were admitted.
* Could be seen as a "cash grab," harboring bad feelings toward the organization.
* Favors registrants with more money.
* Cancellations are penalized, and when they do happen it will be hard to replace the team at the same fee.

How to get it right:

* Be very clear with your communication that admitted registrants are obligated to pay the registration fee and the cancellation will carry a penalty.
* Without penalizing cancellations, the potential for arbitrage exists where a registrant bids higher than they are willing to pay to ensure they are admitted, deciding later if they are willing to pay the eventual cost.
* Best when the pool of applicants is much larger than the event's capacity limit.

Technical details:

* Obviously, it is very important that the ongoing list of bids is kept secret.

### Invitational

1. Open registration to a limited number of invitees. Each invitee should be guaranteed admission should they choose to register.
2. As invitees decline, extend invites to others from a private list.
3. If the invite list is exhausted, additional spots can be filled using one of the open registration formats listed above.

Pros:

* All registrants are guaranteed admission.
* Detailed and private considerations can be made to determine who will attend the event.
* Payment can be collected at registration time.

Cons:

* This is the least-fair option with respect to those who do not receive an invite.
* This may lead to lower diversity of attendees.

How to get it right:

* Consider allowing each invitee to invite a registrant of their choosing. This may complicate matters and reduce the number of invites you can send out, but it may help with the limited diversity.

Technical details:

* Each invitee should be entered into a system by email address or other uniquely-identifying means.
* Do not use invite codes or passwords, as these can be shared without the organizer's permission.