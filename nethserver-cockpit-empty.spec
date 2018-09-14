Name:           nethserver-cockpit-empty
Version:        0.0.0
Release:        1%{?dist}
Summary:        Short description of NethServer Cockpit Empty

License:        GPLv3
URL:            %{url_prefix}/%{name}
Source0:        %{name}-%{version}.tar.gz
# Execute prep-sources to create Source1
Source1:        nethserver-cockpit-empty.tar.gz
BuildArch:      noarch

BuildRequires:  nethserver-devtools
Requires:       nethserver-cockpit

%description
Very very very very very long description of NethServer Cockpit Empty

%prep
%setup

%build
%{makedocs}
perl createlinks

%install
(cd root ; find . -depth -not -name '*.orig' -print | cpio -dump %{buildroot})
mkdir -p %{buildroot}/usr/share/cockpit/nethserver-cockpit-empty/
tar xvf %{SOURCE1} -C %{buildroot}/usr/share/cockpit/nethserver-cockpit-empty/
cp -a nethserver-cockpit-empty.json %{buildroot}/usr/share/cockpit/nethserver/applications/

%dir %{_nseventsdir}/%{name}-update

%changelog
