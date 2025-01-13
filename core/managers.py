from django.contrib.auth.models import BaseUserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def email_valid(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(
                _('%(email)s is not a valid email address'),
                params={'email': email},
            )

    def create_user(self, email, name, password, **extra_fields):
        if email:
            email = self.normalize_email(email)
            self.email_valid(email)
        else:
            raise ValidationError(_("%(email)s is not a valid email address"))
        user = self.model(
            email=email,
            name=name,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('%(staff)s must be True'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('%(superuser)s must be True'))

        user = self.create_user(email, name, password, **extra_fields)
        user.save(using=self._db)
        return user
