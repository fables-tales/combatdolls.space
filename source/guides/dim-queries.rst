Useful DIM Queries
==================

`Destiny Item Manager <https://app.destinyitemmanager.com/>`_ has a rich query language allowing you to select items for use, for archiving, for cleaning, or anything else. See `Item Search <https://github.com/DestinyItemManager/DIM/wiki/Item-Search>`_ and `Item Search Useful Queries <https://github.com/DestinyItemManager/DIM/wiki/Item-Search-Useful-Queries>`_ in the DIM wiki as well as the in-app help.

These are some of our favorite queries.

Harmonizable Weapons
--------------------

Selects all the items that have harmonization available. That is, they are craftable, you have not yet unlocked the pattern, and you have not used a harmonizer on them yet.::

  deepsight:harmonizable

You may wish to keep these items so they're available when you get a harmonizer.

Uncrafted Craftables
--------------------

When you unlock a pattern, it's pretty likely you'll have a bunch of uncrafted versions of it.::

  is:patternunlocked -is:crafted

Since these are probably worse than if you crafted them (no enhanced perks or masterwork), you may wish to junk these.

Armor you can probably trash
----------------------------

After a while you'll have plenty of good armor, and some that isn't especially useful. A base stat score of 60 is usually a good place to start.::

-source:raid is:armor -is:classitem basestat:total:<60 not:locked -is:inloadout
